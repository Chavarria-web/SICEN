import { PartialType } from '@nestjs/mapped-types';
import { CrearCentroEducativoDto } from './crear-centro-educativo.dto';

export class ActualizarCentroEducativoDto extends PartialType(CrearCentroEducativoDto) {}
