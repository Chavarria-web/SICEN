import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lanzarSiDuplicado, validarId, verificarExisten } from '../common/errores';
import { OfertaEducativa } from '../ofertas-educativas/schemas/oferta-educativa.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { CentroEducativo } from './schemas/centro-educativo.schema';
import { CrearCentroEducativoDto } from './dto/crear-centro-educativo.dto';
import { ActualizarCentroEducativoDto } from './dto/actualizar-centro-educativo.dto';

@Injectable()
export class CentrosEducativosService {
  constructor(
    @InjectModel(CentroEducativo.name) private readonly centroModel: Model<CentroEducativo>,
    @InjectModel(OfertaEducativa.name) private readonly ofertaModel: Model<OfertaEducativa>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  async crear(datos: CrearCentroEducativoDto) {
    await verificarExisten(this.ofertaModel, datos.ofertasAutorizadas, 'ofertas educativas');
    try {
      return await this.centroModel.create(datos);
    } catch (e) {
      lanzarSiDuplicado(e, 'Ya existe un centro con ese código.');
    }
  }

  // Colección grande: se pagina y se filtra
  async obtenerTodos(pagina: number, limite: number, direccionRegional?: string, tipo?: string) {
    const filtro: Record<string, unknown> = {};
    if (direccionRegional) filtro.direccionRegional = direccionRegional;
    if (tipo) filtro.tipo = tipo;

    const [datos, total] = await Promise.all([
      this.centroModel
        .find(filtro)
        .sort({ nombre: 1 })
        .skip((pagina - 1) * limite)
        .limit(limite),
      this.centroModel.countDocuments(filtro),
    ]);
    return { pagina, limite, total, datos };
  }

  async obtenerPorId(id: string) {
    validarId(id);
    const centro = await this.centroModel.findById(id).populate('ofertasAutorizadas', 'nombre codigo nivel');
    if (!centro) throw new NotFoundException('Centro educativo no encontrado.');
    return centro;
  }

  async actualizar(id: string, datos: ActualizarCentroEducativoDto) {
    validarId(id);
    if (datos.ofertasAutorizadas) {
      await verificarExisten(this.ofertaModel, datos.ofertasAutorizadas, 'ofertas educativas');
    }
    try {
      const centro = await this.centroModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
      if (!centro) throw new NotFoundException('Centro educativo no encontrado.');
      return centro;
    } catch (e) {
      lanzarSiDuplicado(e, 'Ya existe un centro con ese código.');
    }
  }

  async eliminar(id: string) {
    validarId(id);
    if (await this.usuarioModel.exists({ centroEducativo: id })) {
      throw new ConflictException('El centro tiene directores asociados; elimínelos o reasígnelos primero.');
    }
    const centro = await this.centroModel.findByIdAndDelete(id);
    if (!centro) throw new NotFoundException('Centro educativo no encontrado.');
    return { mensaje: 'Centro educativo eliminado.' };
  }

  // Reporte: cantidad de centros y de estudiantes por dirección regional
  porRegional() {
    return this.centroModel.aggregate([
      {
        $group: {
          _id: '$direccionRegional',
          cantidadCentros: { $sum: 1 },
          totalEstudiantes: { $sum: '$cantidadEstudiantes' },
        },
      },
      { $sort: { cantidadCentros: -1 } },
    ]);
  }
}
