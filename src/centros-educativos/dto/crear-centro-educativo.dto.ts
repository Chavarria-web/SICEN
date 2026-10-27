import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsInt, IsMongoId, IsNotEmpty, IsOptional,
  IsString, Matches, Max, Min, ValidateNested,
} from 'class-validator';
import { TIPOS_CENTRO } from '../schemas/centro-educativo.schema';

export class DireccionDto {
  @IsString() @IsNotEmpty({ message: 'La provincia es obligatoria.' }) provincia: string;
  @IsString() @IsNotEmpty({ message: 'El cantón es obligatorio.' }) canton: string;
  @IsString() @IsNotEmpty({ message: 'El distrito es obligatorio.' }) distrito: string;
  @IsOptional() @IsString() senas?: string;
}

export class CrearCentroEducativoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del centro es obligatorio.' })
  nombre: string;

  @Matches(/^\d{4,5}$/, { message: 'El código debe tener 4 o 5 dígitos.' })
  codigo: string;

  @IsIn(TIPOS_CENTRO, { message: `El tipo debe ser: ${TIPOS_CENTRO.join(', ')}.` })
  tipo: string;

  @IsInt()
  @Min(1, { message: 'La cantidad de estudiantes debe ser al menos 1.' })
  @Max(5000, { message: 'La cantidad de estudiantes no puede superar 5000.' })
  cantidadEstudiantes: number;

  @ValidateNested()
  @Type(() => DireccionDto)
  direccion: DireccionDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'Indique al menos un teléfono.' })
  @ArrayMaxSize(3, { message: 'Máximo 3 teléfonos.' })
  @IsString({ each: true })
  telefonos: string[];

  @IsOptional() @IsString() direccionRegional?: string;
  @IsOptional() @IsString() circuito?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Autorice al menos una oferta educativa.' })
  @ArrayMaxSize(8, { message: 'Máximo 8 ofertas autorizadas.' })
  @IsMongoId({ each: true })
  ofertasAutorizadas: string[];
}
