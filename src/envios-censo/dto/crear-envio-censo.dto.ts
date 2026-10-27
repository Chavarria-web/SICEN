import { IsMongoId } from 'class-validator';

export class CrearEnvioCensoDto {
  @IsMongoId({ message: 'censo debe ser un _id válido.' })
  censo: string;

  @IsMongoId({ message: 'centroEducativo debe ser un _id válido.' })
  centroEducativo: string;

  @IsMongoId({ message: 'formulario debe ser un _id válido.' })
  formulario: string;
}
