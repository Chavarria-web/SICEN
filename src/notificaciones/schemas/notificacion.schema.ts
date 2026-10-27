import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Censo } from '../../censos/schemas/censo.schema';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export const TIPOS_NOTIFICACION = ['Alerta', 'Aviso'];

@Schema()
export class Notificacion {
  @Prop({ type: Types.ObjectId, ref: Censo.name, required: true })
  censo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  destinatario: Types.ObjectId;

  @Prop({ required: true, enum: TIPOS_NOTIFICACION })
  tipo: string;

  @Prop({ required: true, trim: true })
  mensaje: string;

  @Prop({ default: false })
  leida: boolean;

  @Prop({ default: Date.now, immutable: true })
  fecha: Date;
}

export type NotificacionDocument = HydratedDocument<Notificacion>;
export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);
// Consulta típica: no leídas de un destinatario, las más recientes primero
NotificacionSchema.index({ destinatario: 1, leida: 1, fecha: -1 });
