import { PartialType } from '@nestjs/mapped-types';
import { CrearFormularioDto } from './crear-formulario.dto';

export class ActualizarFormularioDto extends PartialType(CrearFormularioDto) {}
