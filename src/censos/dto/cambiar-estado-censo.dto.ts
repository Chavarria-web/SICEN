import { IsIn } from 'class-validator';
import { ESTADOS_CENSO } from '../schemas/censo.schema';

export class CambiarEstadoCensoDto {
  @IsIn(ESTADOS_CENSO, { message: `El estado debe ser: ${ESTADOS_CENSO.join(', ')}.` })
  estado: string;
}
