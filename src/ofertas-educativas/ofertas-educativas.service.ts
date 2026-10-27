import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lanzarSiDuplicado, validarId } from '../common/errores';
import { CentroEducativo } from '../centros-educativos/schemas/centro-educativo.schema';
import { OfertaEducativa } from './schemas/oferta-educativa.schema';
import { CrearOfertaEducativaDto } from './dto/crear-oferta-educativa.dto';
import { ActualizarOfertaEducativaDto } from './dto/actualizar-oferta-educativa.dto';

@Injectable()
export class OfertasEducativasService {
  constructor(
    @InjectModel(OfertaEducativa.name) private readonly ofertaModel: Model<OfertaEducativa>,
    @InjectModel(CentroEducativo.name) private readonly centroModel: Model<CentroEducativo>,
  ) {}

  async crear(datos: CrearOfertaEducativaDto) {
    try {
      return await this.ofertaModel.create(datos);
    } catch (e) {
      lanzarSiDuplicado(e, 'Ya existe una oferta con ese código.');
    }
  }

  // Catálogo pequeño: se puede devolver completo (por ejemplo, para llenar un select)
  obtenerTodas(soloActivas = false) {
    const filtro = soloActivas ? { activa: true } : {};
    return this.ofertaModel.find(filtro).sort({ nivel: 1, nombre: 1 });
  }

  async obtenerPorId(id: string) {
    validarId(id);
    const oferta = await this.ofertaModel.findById(id);
    if (!oferta) throw new NotFoundException('Oferta educativa no encontrada.');
    return oferta;
  }

  async actualizar(id: string, datos: ActualizarOfertaEducativaDto) {
    validarId(id);
    try {
      const oferta = await this.ofertaModel.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
      if (!oferta) throw new NotFoundException('Oferta educativa no encontrada.');
      return oferta;
    } catch (e) {
      lanzarSiDuplicado(e, 'Ya existe una oferta con ese código.');
    }
  }

  async eliminar(id: string) {
    validarId(id);
    // Regla: no se elimina una oferta autorizada en algún centro (mejor desactivarla)
    if (await this.centroModel.exists({ ofertasAutorizadas: id })) {
      throw new ConflictException('La oferta está autorizada en centros educativos; desactívela en su lugar.');
    }
    const oferta = await this.ofertaModel.findByIdAndDelete(id);
    if (!oferta) throw new NotFoundException('Oferta educativa no encontrada.');
    return { mensaje: 'Oferta educativa eliminada.' };
  }
}
