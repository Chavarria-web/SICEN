import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, verificarExisten } from '../common/errores';
import { Censo } from '../censos/schemas/censo.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Formulario } from './schemas/formulario.schema';
import { CrearFormularioDto } from './dto/crear-formulario.dto';
import { ActualizarFormularioDto } from './dto/actualizar-formulario.dto';
import { DuplicarFormularioDto } from './dto/duplicar-formulario.dto';

@Injectable()
export class FormulariosService {
  constructor(
    @InjectModel(Formulario.name) private readonly formularioModel: Model<Formulario>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @InjectModel(Censo.name) private readonly censoModel: Model<Censo>,
  ) {}

  async crear(datos: CrearFormularioDto) {
    await verificarExisten(this.usuarioModel, [datos.creadoPor], 'usuarios');
    return this.formularioModel.create(datos);
  }

  // El listado NO trae las preguntas (son hasta 100 por formulario); se piden con obtenerPorId
  obtenerTodos(esPlantilla?: string) {
    const filtro = esPlantilla === undefined ? {} : { esPlantilla: esPlantilla === 'true' };
    return this.formularioModel
      .find(filtro)
      .select('-preguntas')
      .sort({ fechaCreacion: -1 })
      .populate('creadoPor', 'nombre rol');
  }

  async obtenerPorId(id: string) {
    validarId(id);
    const formulario = await this.formularioModel.findById(id).populate('creadoPor', 'nombre rol');
    if (!formulario) throw new NotFoundException('Formulario no encontrado.');
    return formulario;
  }

  async actualizar(id: string, datos: ActualizarFormularioDto) {
    validarId(id);
    const formulario = await this.formularioModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
    if (!formulario) throw new NotFoundException('Formulario no encontrado.');
    return formulario;
  }

  async eliminar(id: string) {
    validarId(id);
    // Regla: no se elimina un formulario asignado a algún censo
    if (await this.censoModel.exists({ 'asignaciones.formulario': id })) {
      throw new ConflictException('El formulario está asignado a un censo; no se puede eliminar.');
    }
    const formulario = await this.formularioModel.findByIdAndDelete(id);
    if (!formulario) throw new NotFoundException('Formulario no encontrado.');
    return { mensaje: 'Formulario eliminado.' };
  }

  // Crea un formulario nuevo (no plantilla) a partir de una plantilla
  async duplicar(id: string, datos: DuplicarFormularioDto) {
    validarId(id);
    await verificarExisten(this.usuarioModel, [datos.creadoPor], 'usuarios');

    const origen = await this.formularioModel.findById(id).lean();
    if (!origen) throw new NotFoundException('Formulario no encontrado.');

    const { _id, fechaCreacion, ...copia } = origen as any;
    // Las preguntas reciben _id nuevos (se quita el viejo)
    copia.preguntas = copia.preguntas.map(({ _id: _p, ...p }: any) => p);

    return this.formularioModel.create({
      ...copia,
      nombre: datos.nombre ?? `${origen.nombre} (copia)`,
      esPlantilla: false,
      creadoPor: datos.creadoPor,
    });
  }
}
