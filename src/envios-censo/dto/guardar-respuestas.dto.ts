import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDefined, IsMongoId, ValidateNested } from 'class-validator';

export class RespuestaDto {
  @IsMongoId({ message: 'preguntaId debe ser un _id válido.' })
  preguntaId: string;

  @IsDefined({ message: 'La respuesta debe tener un valor.' })
  valor: unknown;
}

export class GuardarRespuestasDto {
  // Sin autenticación en el taller, el usuario que actúa viaja en el cuerpo
  @IsMongoId({ message: 'usuario debe ser un _id válido.' })
  usuario: string;

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => RespuestaDto)
  respuestas: RespuestaDto[];
}
