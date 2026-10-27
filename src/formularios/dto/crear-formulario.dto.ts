import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsIn, IsMongoId,
  IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf, ValidateNested,
} from 'class-validator';
import { TIPOS_CON_OPCIONES, TIPOS_PREGUNTA } from '../schemas/formulario.schema';

export class AparienciaDto {
  @IsOptional() @IsString() colorPrimario?: string;
  @IsOptional() @IsUrl({}, { message: 'El logo debe ser una URL válida.' }) logoUrl?: string;
  @IsOptional() @IsString() enunciado?: string;
}

export class InstructivoDto {
  @IsOptional() @IsString() nombreDocumento?: string;
  @IsOptional() @IsUrl({}, { message: 'El instructivo debe ser una URL válida.' }) urlArchivo?: string;
  @IsOptional() @IsDateString() fechaCarga?: string;
}

export class PreguntaDto {
  @IsString()
  @IsNotEmpty({ message: 'El texto de la pregunta es obligatorio.' })
  texto: string;

  @IsIn(TIPOS_PREGUNTA, { message: `El tipo de pregunta debe ser: ${TIPOS_PREGUNTA.join(', ')}.` })
  tipo: string;

  @IsOptional()
  @IsBoolean()
  obligatoria?: boolean;

  // Obligatorias solo en preguntas de selección
  @ValidateIf((p: PreguntaDto) => TIPOS_CON_OPCIONES.includes(p.tipo))
  @IsArray()
  @ArrayNotEmpty({ message: 'Las preguntas de selección necesitan opciones.' })
  @IsString({ each: true })
  opciones?: string[];
}

export class CrearFormularioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del formulario es obligatorio.' })
  nombre: string;

  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsBoolean() esPlantilla?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => AparienciaDto)
  apariencia?: AparienciaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => InstructivoDto)
  instructivo?: InstructivoDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  flujoAprobacion?: string[];

  @IsArray()
  @ArrayMinSize(10, { message: 'El formulario necesita al menos 10 preguntas.' })
  @ArrayMaxSize(100, { message: 'El formulario admite máximo 100 preguntas.' })
  @ValidateNested({ each: true })
  @Type(() => PreguntaDto)
  preguntas: PreguntaDto[];

  @IsMongoId({ message: 'creadoPor debe ser un _id válido.' })
  creadoPor: string;
}
