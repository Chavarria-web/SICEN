// Utilidades compartidas por los servicios
import { BadRequestException, ConflictException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

// Un _id de MongoDB tiene 24 caracteres hexadecimales.
export function validarId(id: string, nombre = 'identificador') {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`El ${nombre} no es válido.`);
  }
}

// Error 11000 = índice único violado
export function lanzarSiDuplicado(error: any, mensaje: string): never {
  if (error?.code === 11000) throw new ConflictException(mensaje);
  throw error;
}

// Verifica que todos los _id existan en la colección
export async function verificarExisten(model: Model<any>, ids: string[], nombre: string) {
  const unicos = [...new Set(ids.map(String))];
  const cantidad = await model.countDocuments({ _id: { $in: unicos } });
  if (cantidad !== unicos.length) {
    throw new BadRequestException(`Alguno de los ${nombre} indicados no existe.`);
  }
}
