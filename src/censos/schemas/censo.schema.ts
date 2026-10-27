import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Formulario } from '../../formularios/schemas/formulario.schema';
import { OfertaEducativa } from '../../ofertas-educativas/schemas/oferta-educativa.schema';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export const ESTADOS_CENSO = ['Borrador', 'Abierto', 'Pausado', 'Cerrado', 'Anulado'];

// Embebido: qué formulario se aplica a qué oferta educativa en este censo
@Schema({ _id: false })
export class Asignacion {
  @Prop({ type: Types.ObjectId, ref: Formulario.name, required: true })
  formulario: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: OfertaEducativa.name, required: true })
  ofertaEducativa: Types.ObjectId;
}
export const AsignacionSchema = SchemaFactory.createForClass(Asignacion);

@Schema({ _id: false })
export class Mensajes {
  @Prop({ trim: true }) bienvenida?: string;
  @Prop({ trim: true }) alerta?: string;
  @Prop({ trim: true }) aviso?: string;
}
export const MensajesSchema = SchemaFactory.createForClass(Mensajes);

@Schema({ timestamps: true })
export class Censo {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true })
  anio: number;

  @Prop({ type: String, enum: ESTADOS_CENSO, default: 'Borrador' })
  estado: string;

  @Prop()
  fechaApertura?: Date;

  @Prop()
  fechaCierre?: Date;

  // Embebido: de 1 a 10 asignaciones
  @Prop({
    type: [AsignacionSchema],
    validate: { validator: (v: unknown[]) => v.length >= 1 && v.length <= 10, message: 'Un censo debe tener de 1 a 10 asignaciones.' },
  })
  asignaciones: Asignacion[];

  @Prop({ type: MensajesSchema, default: () => ({}) })
  mensajes: Mensajes;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  creadoPor: Types.ObjectId;
}

export type CensoDocument = HydratedDocument<Censo>;
export const CensoSchema = SchemaFactory.createForClass(Censo);
CensoSchema.index({ anio: 1, estado: 1 });
