import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, verificarExisten } from '../common/errores';
import { EnvioCenso } from '../envios-censo/schemas/envio-censo.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Gestion } from './schemas/gestion.schema';
import { CrearGestionDto } from './dto/crear-gestion.dto';

// La bitácora es de solo escritura/lectura: no se actualiza ni se elimina
@Injectable()
export class GestionesService {
  constructor(
    @InjectModel(Gestion.name) private readonly gestionModel: Model<Gestion>,
    @InjectModel(EnvioCenso.name) private readonly envioModel: Model<EnvioCenso>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  async crear(datos: CrearGestionDto) {
    await verificarExisten(this.envioModel, [datos.envioCenso], 'envíos');
    await verificarExisten(this.usuarioModel, [datos.usuario], 'usuarios');
    return this.gestionModel.create(datos);
  }

  // Historial completo de un envío, en orden cronológico
  async porEnvio(envioId: string) {
    validarId(envioId, 'identificador del envío');
    if (!(await this.envioModel.exists({ _id: envioId }))) throw new NotFoundException('Envío no encontrado.');
    return this.gestionModel.find({ envioCenso: envioId }).sort({ fecha: 1 }).populate('usuario', 'nombre rol');
  }
}
