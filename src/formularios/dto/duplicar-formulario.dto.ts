import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DuplicarFormularioDto {
  @IsMongoId({ message: 'creadoPor debe ser un _id válido.' })
  creadoPor: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;
}
