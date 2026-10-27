import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, verificarExisten } from '../common/errores';
import { Censo } from '../censos/schemas/censo.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Notificacion } from './schemas/notificacion.schema';
import { CrearNotificacionDto } from './dto/crear-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name) private readonly notificacionModel: Model<Notificacion>,
    @InjectModel(Censo.name) private readonly censoModel: Model<Censo>,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  async crear(datos: CrearNotificacionDto) {
    await verificarExisten(this.censoModel, [datos.censo], 'censos');
    await verificarExisten(this.usuarioModel, [datos.destinatario], 'usuarios');
    return this.notificacionModel.create(datos);
  }

  // Bandeja del usuario (más recientes primero, máximo 'limite')
  porDestinatario(destinatarioId: string, soloNoLeidas: boolean, limite: number) {
    validarId(destinatarioId, 'identificador del destinatario');
    const filtro: Record<string, unknown> = { destinatario: destinatarioId };
    if (soloNoLeidas) filtro.leida = false;
    return this.notificacionModel.find(filtro).sort({ fecha: -1 }).limit(limite).populate('censo', 'nombre anio');
  }

  async contarNoLeidas(destinatarioId: string) {
    validarId(destinatarioId, 'identificador del destinatario');
    const noLeidas = await this.notificacionModel.countDocuments({ destinatario: destinatarioId, leida: false });
    return { noLeidas };
  }

  async marcarLeida(id: string) {
    validarId(id);
    const notificacion = await this.notificacionModel.findByIdAndUpdate(id, { leida: true }, { new: true });
    if (!notificacion) throw new NotFoundException('Notificación no encontrada.');
    return notificacion;
  }

  async marcarTodasLeidas(destinatarioId: string) {
    validarId(destinatarioId, 'identificador del destinatario');
    const r = await this.notificacionModel.updateMany({ destinatario: destinatarioId, leida: false }, { leida: true });
    return { marcadas: r.modifiedCount };
  }
}
