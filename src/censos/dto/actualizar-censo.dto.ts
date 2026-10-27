import { PartialType } from '@nestjs/mapped-types';
import { CrearCensoDto } from './crear-censo.dto';

// El estado NO se cambia por aquí: tiene su propio endpoint con reglas de transición
export class ActualizarCensoDto extends PartialType(CrearCensoDto) {}
