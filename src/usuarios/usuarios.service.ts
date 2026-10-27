import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { lanzarSiDuplicado, validarId } from '../common/errores';
import { CentroEducativo } from '../centros-educativos/schemas/centro-educativo.schema';
import { Usuario } from './schemas/usuario.schema';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

const MAX_DIRECTORES_POR_CENTRO = 3;

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @InjectModel(CentroEducativo.name) private readonly centroModel: Model<CentroEducativo>,
  ) {}

  async crear(datos: CrearUsuarioDto) {
    await this.validarReglasDeRol(datos.rol, datos.centroEducativo);

    try {
      const hash = await bcrypt.hash(datos.contrasenna, 10);
      const usuario = await this.usuarioModel.create({ ...datos, contrasenna: hash });
      const resultado = usuario.toObject() as unknown as Record<string, unknown>;
      delete resultado.contrasenna;
      return resultado;
    } catch (e) {
      lanzarSiDuplicado(e, 'Ya existe un usuario con ese correo.');
    }
  }

  // Colección grande: se filtra y se pagina
  async obtenerTodos(pagina: number, limite: number, rol?: string, centroEducativo?: string) {
    const filtro: Record<string, unknown> = {};
    if (rol) filtro.rol = rol;
    if (centroEducativo) {
      validarId(centroEducativo, 'identificador del centro');
      filtro.centroEducativo = centroEducativo;
    }
    const [datos, total] = await Promise.all([
      this.usuarioModel.find(filtro).sort({ nombre: 1 }).skip((pagina - 1) * limite).limit(limite),
      this.usuarioModel.countDocuments(filtro),
    ]);
    return { pagina, limite, total, datos };
  }

  async obtenerPorId(id: string) {
    validarId(id);
    const usuario = await this.usuarioModel.findById(id).populate('centroEducativo', 'nombre codigo');
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    return usuario;
  }

  async actualizar(id: string, datos: ActualizarUsuarioDto) {
    validarId(id);
    const actual = await this.usuarioModel.findById(id);
    if (!actual) throw new NotFoundException('Usuario no encontrado.');

    // Se valida el resultado final (lo que ya tenía + lo que cambia)
    const rol = datos.rol ?? actual.rol;
    const centro = datos.centroEducativo ?? actual.centroEducativo?.toString();
    await this.validarReglasDeRol(rol, centro, id);

    const cambios: Record<string, unknown> = { ...datos };
    if (datos.contrasenna) cambios.contrasenna = await bcrypt.hash(datos.contrasenna, 10);
    if (rol !== 'Director') cambios.centroEducativo = undefined;

    try {
      return await this.usuarioModel.findByIdAndUpdate(id, cambios, { new: true, runValidators: true });
    } catch (e) {
      lanzarSiDuplicado(e, 'Ya existe un usuario con ese correo.');
    }
  }

  // En vez de borrar al usuario (la bitácora de Gestión lo referencia), se desactiva
  async desactivar(id: string) {
    validarId(id);
    const usuario = await this.usuarioModel.findByIdAndUpdate(id, { activo: false }, { new: true });
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    return { mensaje: 'Usuario desactivado.' };
  }

  // Reglas: Director debe tener centro (máx. 3 directores por centro); los demás roles no
  private async validarReglasDeRol(rol: string, centroEducativo?: string, idUsuario?: string) {
    if (rol !== 'Director') {
      if (centroEducativo) throw new BadRequestException('Solo el rol Director puede tener centro educativo.');
      return;
    }
    if (!centroEducativo) throw new BadRequestException('El Director debe tener un centro educativo.');
    validarId(centroEducativo, 'identificador del centro');
    if (!(await this.centroModel.exists({ _id: centroEducativo }))) {
      throw new BadRequestException('El centro educativo indicado no existe.');
    }
    const filtro: Record<string, unknown> = { rol: 'Director', centroEducativo, activo: true };
    if (idUsuario) filtro._id = { $ne: idUsuario };
    const directores = await this.usuarioModel.countDocuments(filtro);
    if (directores >= MAX_DIRECTORES_POR_CENTRO) {
      throw new BadRequestException(`Un centro puede tener máximo ${MAX_DIRECTORES_POR_CENTRO} directores.`);
    }
  }
}
