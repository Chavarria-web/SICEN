import {
  Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { CentrosEducativosService } from './centros-educativos.service';
import { CrearCentroEducativoDto } from './dto/crear-centro-educativo.dto';
import { ActualizarCentroEducativoDto } from './dto/actualizar-centro-educativo.dto';

@Controller('centros-educativos')
export class CentrosEducativosController {
  constructor(private readonly service: CentrosEducativosService) {}

  @Post()
  crear(@Body() datos: CrearCentroEducativoDto) {
    return this.service.crear(datos);
  }

  // Las rutas con texto fijo van ANTES de ':id'
  // GET /centros-educativos/por-regional
  @Get('por-regional')
  porRegional() {
    return this.service.porRegional();
  }

  // GET /centros-educativos?pagina=1&limite=20&direccionRegional=Cartago&tipo=Publico
  @Get()
  obtenerTodos(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('direccionRegional') direccionRegional?: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.service.obtenerTodos(pagina, limite, direccionRegional, tipo);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: ActualizarCentroEducativoDto) {
    return this.service.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
