import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Censo } from '../../censos/schemas/censo.schema';
import { CentroEducativo } from '../../centros-educativos/schemas/centro-educativo.schema';
import { Formulario } from '../../formularios/schemas/formulario.schema';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export const ESTADOS_ENVIO = ['Pendiente', 'EnProgreso', 'Enviado', 'Devuelto', 'Aceptado'];

// Respuesta embebida: de 10 a 100 por envío (una por pregunta del formulario)
@Schema({ _id: false })
export class Respuesta {
  @Prop({ type: Types.ObjectId, required: true })
  preguntaId: Types.ObjectId;

  @Prop({ type: Object })
  valor: unknown;
}
export const RespuestaSchema = SchemaFactory.createForClass(Respuesta);

@Schema({ timestamps: true })
export class EnvioCenso {
  @Prop({ type: Types.ObjectId, ref: Censo.name, required: true })
  censo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: CentroEducativo.name, required: true })
  centroEducativo: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Formulario.name, required: true })
  formulario: Types.ObjectId;

  @Prop({ type: String, enum: ESTADOS_ENVIO, default: 'Pendiente' })
  estado: string;

  @Prop({
    type: [RespuestaSchema],
    default: [],
    validate: { validator: (v: unknown[]) => v.length <= 100, message: 'Máximo 100 respuestas.' },
  })
  respuestas: Respuesta[];

  @Prop({ trim: true })
  motivoDevolucion?: string;

  @Prop()
  fechaEnvio?: Date;

  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  revisadoPor?: Types.ObjectId;
}

export type EnvioCensoDocument = HydratedDocument<EnvioCenso>;
export const EnvioCensoSchema = SchemaFactory.createForClass(EnvioCenso);

// "unico compuesto": un centro solo tiene un envío por formulario en cada censo
EnvioCensoSchema.index({ censo: 1, centroEducativo: 1, formulario: 1 }, { unique: true });
// Para listar por censo y estado (~4000 envíos por censo)
EnvioCensoSchema.index({ censo: 1, estado: 1 });
