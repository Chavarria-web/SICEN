import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsInt, IsMongoId, IsNotEmpty, IsOptional,
  IsString, Max, Min, ValidateNested,
} from 'class-validator';

export class AsignacionDto {
  @IsMongoId({ message: 'El formulario debe ser un _id válido.' })
  formulario: string;

  @IsMongoId({ message: 'La oferta educativa debe ser un _id válido.' })
  ofertaEducativa: string;
}

export class MensajesDto {
  @IsOptional() @IsString() bienvenida?: string;
  @IsOptional() @IsString() alerta?: string;
  @IsOptional() @IsString() aviso?: string;
}

export class CrearCensoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del censo es obligatorio.' })
  nombre: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  anio: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de apertura debe tener el formato AAAA-MM-DD.' })
  fechaApertura?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de cierre debe tener el formato AAAA-MM-DD.' })
  fechaCierre?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Indique al menos una asignación.' })
  @ArrayMaxSize(10, { message: 'Máximo 10 asignaciones.' })
  @ValidateNested({ each: true })
  @Type(() => AsignacionDto)
  asignaciones: AsignacionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MensajesDto)
  mensajes?: MensajesDto;

  @IsMongoId({ message: 'creadoPor debe ser un _id válido.' })
  creadoPor: string;
}
