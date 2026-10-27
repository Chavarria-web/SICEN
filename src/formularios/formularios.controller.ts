import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FormulariosService } from './formularios.service';
import { CrearFormularioDto } from './dto/crear-formulario.dto';
import { ActualizarFormularioDto } from './dto/actualizar-formulario.dto';
import { DuplicarFormularioDto } from './dto/duplicar-formulario.dto';

@Controller('formularios')
export class FormulariosController {
  constructor(private readonly service: FormulariosService) {}

  @Post()
  crear(@Body() datos: CrearFormularioDto) {
    return this.service.crear(datos);
  }

  // GET /formularios?esPlantilla=true
  @Get()
  obtenerTodos(@Query('esPlantilla') esPlantilla?: string) {
    return this.service.obtenerTodos(esPlantilla);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  // POST /formularios/:id/duplicar
  @Post(':id/duplicar')
  duplicar(@Param('id') id: string, @Body() datos: DuplicarFormularioDto) {
    return this.service.duplicar(id, datos);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: ActualizarFormularioDto) {
    return this.service.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
