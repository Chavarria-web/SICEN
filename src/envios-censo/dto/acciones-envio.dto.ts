import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AccionEnvioDto {
  @IsMongoId({ message: 'usuario debe ser un _id válido.' })
  usuario: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}

export class DevolverEnvioDto {
  @IsMongoId({ message: 'usuario debe ser un _id válido.' })
  usuario: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe indicar el motivo de la devolución.' })
  motivoDevolucion: string;
}
