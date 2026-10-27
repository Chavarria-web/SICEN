import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OfertaEducativa } from '../../ofertas-educativas/schemas/oferta-educativa.schema';

export const TIPOS_CENTRO = ['Publico', 'Privado'];

// Subdocumento embebido: la dirección pertenece al centro
@Schema({ _id: false })
export class Direccion {
  @Prop({ required: true, trim: true }) provincia: string;
  @Prop({ required: true, trim: true }) canton: string;
  @Prop({ required: true, trim: true }) distrito: string;
  @Prop({ trim: true }) senas?: string;
}
export const DireccionSchema = SchemaFactory.createForClass(Direccion);

@Schema({ timestamps: true })
export class CentroEducativo {
  @Prop({ required: true, trim: true })
  nombre: string;

  // Código de 4 o 5 dígitos, único
  @Prop({ required: true, unique: true, trim: true, match: /^\d{4,5}$/ })
  codigo: string;

  @Prop({ required: true, enum: TIPOS_CENTRO })
  tipo: string;

  @Prop({ required: true, min: 1, max: 5000 })
  cantidadEstudiantes: number;

  @Prop({ type: DireccionSchema, required: true })
  direccion: Direccion;

  // Embebido: de 1 a 3 teléfonos
  @Prop({
    type: [String],
    validate: { validator: (v: string[]) => v.length >= 1 && v.length <= 3, message: 'Debe registrar de 1 a 3 teléfonos.' },
  })
  telefonos: string[];

  @Prop({ trim: true })
  direccionRegional?: string;

  @Prop({ trim: true })
  circuito?: string;

  // Referencias: de 1 a 8 ofertas autorizadas
  @Prop({
    type: [{ type: Types.ObjectId, ref: OfertaEducativa.name }],
    validate: { validator: (v: unknown[]) => v.length >= 1 && v.length <= 8, message: 'Debe autorizar de 1 a 8 ofertas.' },
  })
  ofertasAutorizadas: Types.ObjectId[];
}

export type CentroEducativoDocument = HydratedDocument<CentroEducativo>;
export const CentroEducativoSchema = SchemaFactory.createForClass(CentroEducativo);
