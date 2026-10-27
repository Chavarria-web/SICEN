import {
  Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  crear(@Body() datos: CrearUsuarioDto) {
    return this.service.crear(datos);
  }

  // GET /usuarios?pagina=1&limite=20&rol=Director&centroEducativo=<id>
  @Get()
  obtenerTodos(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('rol') rol?: string,
    @Query('centroEducativo') centroEducativo?: string,
  ) {
    return this.service.obtenerTodos(pagina, limite, rol, centroEducativo);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: ActualizarUsuarioDto) {
    return this.service.actualizar(id, datos);
  }

  // DELETE /usuarios/:id  -> desactiva (no borra)
  @Delete(':id')
  desactivar(@Param('id') id: string) {
    return this.service.desactivar(id);
  }
}
