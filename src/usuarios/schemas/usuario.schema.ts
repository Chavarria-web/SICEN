import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CentroEducativo } from '../../centros-educativos/schemas/centro-educativo.schema';

export const ROLES = ['JefaturaDAE', 'TecnicoDAE', 'Director'];

// Subdocumento embebido: ámbito de trabajo (tipo y nombre)
@Schema({ _id: false })
export class Ambito {
  @Prop({ trim: true }) tipo?: string;
  @Prop({ trim: true }) nombre?: string;
}
export const AmbitoSchema = SchemaFactory.createForClass(Ambito);

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  correo: string;

  // select: false -> nunca se devuelve en las consultas; se guarda cifrada (hash)
  @Prop({ required: true, select: false })
  contrasenna: string;

  @Prop({ required: true, enum: ROLES })
  rol: string;

  @Prop({ type: [String], default: [] })
  permisos: string[];

  @Prop({ type: AmbitoSchema })
  ambito?: Ambito;

  // Solo para el rol Director
  @Prop({ type: Types.ObjectId, ref: CentroEducativo.name })
  centroEducativo?: Types.ObjectId;

  @Prop({ default: true })
  activo: boolean;
}

export type UsuarioDocument = HydratedDocument<Usuario>;
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
