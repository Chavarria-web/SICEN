import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const NIVELES_OFERTA = ['Preescolar', 'Primaria', 'Secundaria', 'Educacion Especial'];

@Schema({ timestamps: true })
export class OfertaEducativa {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  codigo: string;

  @Prop({ required: true, enum: NIVELES_OFERTA })
  nivel: string;

  @Prop({ trim: true })
  descripcion?: string;

  @Prop({ default: true })
  activa: boolean;
}

export type OfertaEducativaDocument = HydratedDocument<OfertaEducativa>;
export const OfertaEducativaSchema = SchemaFactory.createForClass(OfertaEducativa);
