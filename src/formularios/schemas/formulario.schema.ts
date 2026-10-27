import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export const TIPOS_PREGUNTA = ['Texto', 'Numero', 'Fecha', 'SiNo', 'SeleccionUnica', 'SeleccionMultiple'];
export const TIPOS_CON_OPCIONES = ['SeleccionUnica', 'SeleccionMultiple'];

@Schema({ _id: false })
export class Apariencia {
  @Prop({ trim: true }) colorPrimario?: string;
  @Prop({ trim: true }) logoUrl?: string;
  @Prop({ trim: true }) enunciado?: string;
}
export const AparienciaSchema = SchemaFactory.createForClass(Apariencia);

@Schema({ _id: false })
export class Instructivo {
  @Prop({ trim: true }) nombreDocumento?: string;
  @Prop({ trim: true }) urlArchivo?: string;
  @Prop() fechaCarga?: Date;
}
export const InstructivoSchema = SchemaFactory.createForClass(Instructivo);

// Pregunta embebida: conserva su _id para que las respuestas la referencien (preguntaId)
@Schema()
export class Pregunta {
  _id?: Types.ObjectId;

  @Prop({ required: true, trim: true }) texto: string;
  @Prop({ required: true, enum: TIPOS_PREGUNTA }) tipo: string;
  @Prop({ default: false }) obligatoria: boolean;
  @Prop({ type: [String], default: [] }) opciones: string[];
}
export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);

@Schema()
export class Formulario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ trim: true })
  descripcion?: string;

  @Prop({ default: false })
  esPlantilla: boolean;

  @Prop({ type: AparienciaSchema })
  apariencia?: Apariencia;

  @Prop({ type: InstructivoSchema })
  instructivo?: Instructivo;

  // Pasos del flujo de aprobación (ej.: ['TecnicoDAE', 'JefaturaDAE'])
  @Prop({ type: [String], default: [] })
  flujoAprobacion: string[];

  // Embebido: de 10 a 100 preguntas
  @Prop({
    type: [PreguntaSchema],
    validate: { validator: (v: unknown[]) => v.length >= 10 && v.length <= 100, message: 'El formulario debe tener de 10 a 100 preguntas.' },
  })
  preguntas: Pregunta[];

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  creadoPor: Types.ObjectId;

  @Prop({ default: Date.now, immutable: true })
  fechaCreacion: Date;
}

export type FormularioDocument = HydratedDocument<Formulario>;
export const FormularioSchema = SchemaFactory.createForClass(Formulario);
