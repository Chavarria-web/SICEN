import { Type } from 'class-transformer';
import {
  IsArray, IsEmail, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, ValidateNested,
} from 'class-validator';
import { ROLES } from '../schemas/usuario.schema';

export class AmbitoDto {
  @IsOptional() @IsString() tipo?: string;
  @IsOptional() @IsString() nombre?: string;
}

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  correo: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  contrasenna: string;

  @IsIn(ROLES, { message: `El rol debe ser: ${ROLES.join(', ')}.` })
  rol: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permisos?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AmbitoDto)
  ambito?: AmbitoDto;

  // Obligatorio solo si el rol es Director
  @ValidateIf((u: CrearUsuarioDto) => u.rol === 'Director' || u.centroEducativo !== undefined)
  @IsMongoId({ message: 'El centro educativo debe ser un _id válido.' })
  centroEducativo?: string;
}
