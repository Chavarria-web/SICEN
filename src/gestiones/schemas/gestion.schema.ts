import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EnvioCenso } from '../../envios-censo/schemas/envio-censo.schema';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export const ACCIONES_GESTION = ['Envio', 'Revision', 'Aceptacion', 'Devolucion', 'Correccion', 'Reenvio'];

// Bitácora: cada acción sobre un envío queda registrada (crece: de 3 a 20 por envío)
@Schema()
export class Gestion {
  @Prop({ type: Types.ObjectId, ref: EnvioCenso.name, required: true, index: true })
  envioCenso: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuario: Types.ObjectId;

  @Prop({ required: true, enum: ACCIONES_GESTION })
  accion: string;

  @Prop({ required: true, trim: true })
  estadoResultante: string;

  @Prop({ trim: true })
  observacion?: string;

  @Prop({ default: Date.now, immutable: true })
  fecha: Date;
}

export type GestionDocument = HydratedDocument<Gestion>;
export const GestionSchema = SchemaFactory.createForClass(Gestion);
