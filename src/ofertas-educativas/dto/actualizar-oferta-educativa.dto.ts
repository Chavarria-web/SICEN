import { PartialType } from '@nestjs/mapped-types';
import { CrearOfertaEducativaDto } from './crear-oferta-educativa.dto';

export class ActualizarOfertaEducativaDto extends PartialType(CrearOfertaEducativaDto) {}
