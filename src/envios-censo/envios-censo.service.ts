import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lanzarSiDuplicado, validarId, verificarExisten } from '../common/errores';
import { Censo } from '../censos/schemas/censo.schema';
import { CentroEducativo } from '../centros-educativos/schemas/centro-educativo.schema';
import { Formulario } from '../formularios/schemas/formulario.schema';
import { Gestion } from '../gestiones/schemas/gestion.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { EnvioCenso } from './schemas/envio-censo.schema';
import { CrearEnvioCensoDto } from './dto/crear-envio-censo.dto';
import { GuardarRespuestasDto } from './dto/guardar-respuestas.dto';

/*
  Ciclo de vida del envío (cada paso queda en la bitácora "Gestion"):
  Pendiente --guardar--> EnProgreso --enviar--> Enviado --devolver--> Devuelto
                                                   |                     |
                                                   +--aceptar--> Aceptado  +--guardar (Correccion)--> EnProgreso --enviar (Reenvio)--> Enviado
*/
@Injectable()
export class EnviosCensoService {
  constructor(
    @InjectModel(EnvioCenso.name) private readonly envioModel: Model<EnvioCenso>,
    @InjectModel(Censo.name) private readonly censoModel: Model<Censo>,
    @InjectModel(CentroEducativo.name) private readonly centroModel: Model<CentroEducativo>,
    @InjectModel(Formulario.name) private readonly formularioModel: Model<Formulario>,
    @InjectModel(Gestion.name) private readonly gestionModel: Model<Gestion>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  // Crea el envío (Pendiente) de un centro para un formulario del censo
  async crear(datos: CrearEnvioCensoDto) {
    const censo = await this.censoModel.findById(datos.censo);
    if (!censo) throw new NotFoundException('Censo no encontrado.');
    if (censo.estado !== 'Abierto') throw new BadRequestException('El censo no está abierto.');

    const centro = await this.centroModel.findById(datos.centroEducativo);
    if (!centro) throw new NotFoundException('Centro educativo no encontrado.');

    // El formulario debe estar asignado al censo para una oferta que el centro tenga autorizada
    const asignadas = censo.asignaciones.filter((a) => String(a.formulario) === datos.formulario);
    if (!asignadas.length) throw new BadRequestException('El formulario no está asignado a este censo.');
    const autorizado = asignadas.some((a) =>
      centro.ofertasAutorizadas.some((o) => String(o) === String(a.ofertaEducativa)),
    );
    if (!autorizado) {
      throw new BadRequestException('El centro no tiene autorizada la oferta a la que aplica este formulario.');
    }

    try {
      return await this.envioModel.create(datos);
    } catch (e) {
      lanzarSiDuplicado(e, 'Ese centro ya tiene un envío de este formulario para el censo.');
    }
  }

  // ~4000 envíos por censo: siempre filtrado y paginado
  async listar(pagina: number, limite: number, censo?: string, centroEducativo?: string, estado?: string) {
    const filtro: Record<string, unknown> = {};
    if (censo) { validarId(censo, 'identificador del censo'); filtro.censo = censo; }
    if (centroEducativo) { validarId(centroEducativo, 'identificador del centro'); filtro.centroEducativo = centroEducativo; }
    if (estado) filtro.estado = estado;

    const [datos, total] = await Promise.all([
      this.envioModel
        .find(filtro)
        .select('-respuestas') // las respuestas solo se piden en el detalle
        .sort({ updatedAt: -1 })
        .skip((pagina - 1) * limite)
        .limit(limite)
        .populate('centroEducativo', 'nombre codigo')
        .populate('formulario', 'nombre'),
      this.envioModel.countDocuments(filtro),
    ]);
    return { pagina, limite, total, datos };
  }

  async obtenerPorId(id: string) {
    validarId(id);
    const envio = await this.envioModel
      .findById(id)
      .populate('centroEducativo', 'nombre codigo')
      .populate('formulario', 'nombre preguntas')
      .populate('revisadoPor', 'nombre rol');
    if (!envio) throw new NotFoundException('Envío no encontrado.');
    return envio;
  }

  // El centro llena (o corrige) el formulario
  async guardarRespuestas(id: string, datos: GuardarRespuestasDto) {
    const envio = await this.buscar(id);
    await this.exigirCensoAbierto(envio.censo.toString());
    await verificarExisten(this.usuarioModel, [datos.usuario], 'usuarios');

    if (!['Pendiente', 'EnProgreso', 'Devuelto'].includes(envio.estado)) {
      throw new BadRequestException(`No se pueden modificar las respuestas de un envío ${envio.estado}.`);
    }

    // Cada respuesta debe corresponder a una pregunta del formulario
    const formulario = await this.formularioModel.findById(envio.formulario);
    const ids = new Set((formulario?.preguntas ?? []).map((p) => String(p._id)));
    const invalida = datos.respuestas.find((r) => !ids.has(r.preguntaId));
    if (invalida) throw new BadRequestException(`La pregunta ${invalida.preguntaId} no pertenece al formulario.`);

    const eraDevuelto = envio.estado === 'Devuelto';
    envio.respuestas = datos.respuestas as any;
    envio.estado = 'EnProgreso';
    await envio.save();

    if (eraDevuelto) await this.registrar(envio, datos.usuario, 'Correccion');
    return envio;
  }

  async enviar(id: string, usuario: string, observacion?: string) {
    const envio = await this.buscar(id);
    await this.exigirCensoAbierto(envio.censo.toString());
    await verificarExisten(this.usuarioModel, [usuario], 'usuarios');
    if (envio.estado !== 'EnProgreso') {
      throw new BadRequestException('Solo se puede enviar un formulario que está En progreso.');
    }

    // Todas las preguntas obligatorias deben tener respuesta
    const formulario = await this.formularioModel.findById(envio.formulario);
    const respondidas = new Set(
      envio.respuestas
        .filter((r) => r.valor !== null && r.valor !== undefined && r.valor !== '')
        .map((r) => String(r.preguntaId)),
    );
    const faltantes = (formulario?.preguntas ?? []).filter((p) => p.obligatoria && !respondidas.has(String(p._id)));
    if (faltantes.length) {
      throw new BadRequestException(`Faltan ${faltantes.length} pregunta(s) obligatoria(s) por responder.`);
    }

    const esReenvio = !!envio.motivoDevolucion;
    envio.estado = 'Enviado';
    envio.fechaEnvio = new Date();
    await envio.save();

    await this.registrar(envio, usuario, esReenvio ? 'Reenvio' : 'Envio', observacion);
    return envio;
  }

  async devolver(id: string, usuario: string, motivoDevolucion: string) {
    const envio = await this.buscar(id);
    await verificarExisten(this.usuarioModel, [usuario], 'usuarios');
    if (envio.estado !== 'Enviado') throw new BadRequestException('Solo se puede devolver un envío Enviado.');

    envio.estado = 'Devuelto';
    envio.motivoDevolucion = motivoDevolucion;
    envio.revisadoPor = usuario as any;
    await envio.save();

    await this.registrar(envio, usuario, 'Devolucion', motivoDevolucion);
    return envio;
  }

  async aceptar(id: string, usuario: string, observacion?: string) {
    const envio = await this.buscar(id);
    await verificarExisten(this.usuarioModel, [usuario], 'usuarios');
    if (envio.estado !== 'Enviado') throw new BadRequestException('Solo se puede aceptar un envío Enviado.');

    envio.estado = 'Aceptado';
    envio.revisadoPor = usuario as any;
    await envio.save();

    await this.registrar(envio, usuario, 'Aceptacion', observacion);
    return envio;
  }

  private async buscar(id: string) {
    validarId(id);
    const envio = await this.envioModel.findById(id);
    if (!envio) throw new NotFoundException('Envío no encontrado.');
    return envio;
  }

  private async exigirCensoAbierto(censoId: string) {
    const censo = await this.censoModel.findById(censoId).select('estado');
    if (censo?.estado !== 'Abierto') throw new BadRequestException('El censo no está abierto.');
  }

  // Deja la huella en la bitácora (colección Gestion)
  private registrar(envio: { _id: any; estado: string }, usuario: string, accion: string, observacion?: string) {
    return this.gestionModel.create({
      envioCenso: envio._id,
      usuario,
      accion,
      estadoResultante: envio.estado,
      observacion,
    });
  }
}
