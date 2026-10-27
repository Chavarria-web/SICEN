import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { validarId, verificarExisten } from '../common/errores';
import { EnvioCenso } from '../envios-censo/schemas/envio-censo.schema';
import { Formulario } from '../formularios/schemas/formulario.schema';
import { OfertaEducativa } from '../ofertas-educativas/schemas/oferta-educativa.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Censo } from './schemas/censo.schema';
import { CrearCensoDto, AsignacionDto } from './dto/crear-censo.dto';
import { ActualizarCensoDto } from './dto/actualizar-censo.dto';

// Transiciones permitidas del ciclo de vida del censo
const TRANSICIONES: Record<string, string[]> = {
  Borrador: ['Abierto', 'Anulado'],
  Abierto: ['Pausado', 'Cerrado', 'Anulado'],
  Pausado: ['Abierto', 'Cerrado', 'Anulado'],
  Cerrado: [],
  Anulado: [],
};

@Injectable()
export class CensosService {
  constructor(
    @InjectModel(Censo.name) private readonly censoModel: Model<Censo>,
    @InjectModel(Formulario.name) private readonly formularioModel: Model<Formulario>,
    @InjectModel(OfertaEducativa.name) private readonly ofertaModel: Model<OfertaEducativa>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @InjectModel(EnvioCenso.name) private readonly envioModel: Model<EnvioCenso>,
  ) {}

  async crear(datos: CrearCensoDto) {
    this.validarFechas(datos.fechaApertura, datos.fechaCierre);
    await this.validarReferencias(datos.asignaciones, datos.creadoPor);
    return this.censoModel.create(datos);
  }

  // GET /censos?anio=2026&estado=Abierto
  obtenerTodos(anio?: number, estado?: string) {
    const filtro: Record<string, unknown> = {};
    if (anio) filtro.anio = anio;
    if (estado) filtro.estado = estado;
    return this.censoModel.find(filtro).sort({ anio: -1, nombre: 1 });
  }

  async obtenerPorId(id: string) {
    validarId(id);
    const censo = await this.censoModel
      .findById(id)
      .populate('asignaciones.formulario', 'nombre esPlantilla')
      .populate('asignaciones.ofertaEducativa', 'nombre nivel')
      .populate('creadoPor', 'nombre rol');
    if (!censo) throw new NotFoundException('Censo no encontrado.');
    return censo;
  }

  async actualizar(id: string, datos: ActualizarCensoDto) {
    validarId(id);
    const actual = await this.censoModel.findById(id);
    if (!actual) throw new NotFoundException('Censo no encontrado.');
    if (['Cerrado', 'Anulado'].includes(actual.estado)) {
      throw new BadRequestException(`Un censo ${actual.estado.toLowerCase()} no se puede modificar.`);
    }

    this.validarFechas(
      datos.fechaApertura ?? actual.fechaApertura?.toISOString(),
      datos.fechaCierre ?? actual.fechaCierre?.toISOString(),
    );
    await this.validarReferencias(datos.asignaciones, datos.creadoPor);

    return this.censoModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  }

  async cambiarEstado(id: string, nuevoEstado: string) {
    validarId(id);
    const censo = await this.censoModel.findById(id);
    if (!censo) throw new NotFoundException('Censo no encontrado.');

    if (!TRANSICIONES[censo.estado].includes(nuevoEstado)) {
      throw new BadRequestException(`No se puede pasar de ${censo.estado} a ${nuevoEstado}.`);
    }
    if (nuevoEstado === 'Abierto' && (!censo.fechaApertura || !censo.fechaCierre)) {
      throw new BadRequestException('Para abrir el censo debe definir las fechas de apertura y cierre.');
    }
    censo.estado = nuevoEstado;
    return censo.save();
  }

  async eliminar(id: string) {
    validarId(id);
    const censo = await this.censoModel.findById(id);
    if (!censo) throw new NotFoundException('Censo no encontrado.');
    if (censo.estado !== 'Borrador') {
      throw new ConflictException('Solo se puede eliminar un censo en Borrador; use Anulado en los demás casos.');
    }
    if (await this.envioModel.exists({ censo: id })) {
      throw new ConflictException('El censo ya tiene envíos registrados.');
    }
    await censo.deleteOne();
    return { mensaje: 'Censo eliminado.' };
  }

  // Avance del censo: cantidad de envíos por estado (para el tablero de la jefatura)
  async avance(id: string) {
    validarId(id);
    if (!(await this.censoModel.exists({ _id: id }))) throw new NotFoundException('Censo no encontrado.');
    return this.envioModel.aggregate([
      { $match: { censo: new Types.ObjectId(id) } },
      { $group: { _id: '$estado', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
    ]);
  }

  private validarFechas(apertura?: string, cierre?: string) {
    if (apertura && cierre && new Date(cierre) < new Date(apertura)) {
      throw new BadRequestException('La fecha de cierre no puede ser anterior a la fecha de apertura.');
    }
  }

  private async validarReferencias(asignaciones?: AsignacionDto[], creadoPor?: string) {
    if (creadoPor) await verificarExisten(this.usuarioModel, [creadoPor], 'usuarios');
    if (asignaciones) {
      await verificarExisten(this.formularioModel, asignaciones.map((a) => a.formulario), 'formularios');
      await verificarExisten(this.ofertaModel, asignaciones.map((a) => a.ofertaEducativa), 'ofertas educativas');
    }
  }
}
