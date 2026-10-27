import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NIVELES_OFERTA } from '../schemas/oferta-educativa.schema';

export class CrearOfertaEducativaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la oferta es obligatorio.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El código de la oferta es obligatorio.' })
  codigo: string;

  @IsIn(NIVELES_OFERTA, { message: `El nivel debe ser: ${NIVELES_OFERTA.join(', ')}.` })
  nivel: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
