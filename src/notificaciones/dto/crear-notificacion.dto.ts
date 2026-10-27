import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { TIPOS_NOTIFICACION } from '../schemas/notificacion.schema';

export class CrearNotificacionDto {
  @IsMongoId({ message: 'censo debe ser un _id válido.' })
  censo: string;

  @IsMongoId({ message: 'destinatario debe ser un _id válido.' })
  destinatario: string;

  @IsIn(TIPOS_NOTIFICACION, { message: `El tipo debe ser: ${TIPOS_NOTIFICACION.join(', ')}.` })
  tipo: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
  mensaje: string;
}
