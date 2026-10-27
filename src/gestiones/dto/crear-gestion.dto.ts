import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ACCIONES_GESTION } from '../schemas/gestion.schema';

export class CrearGestionDto {
  @IsMongoId({ message: 'envioCenso debe ser un _id válido.' })
  envioCenso: string;

  @IsMongoId({ message: 'usuario debe ser un _id válido.' })
  usuario: string;

  @IsIn(ACCIONES_GESTION, { message: `La acción debe ser: ${ACCIONES_GESTION.join(', ')}.` })
  accion: string;

  @IsString()
  @IsNotEmpty({ message: 'El estado resultante es obligatorio.' })
  estadoResultante: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
