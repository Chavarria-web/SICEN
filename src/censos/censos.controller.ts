import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CensosService } from './censos.service';
import { CrearCensoDto } from './dto/crear-censo.dto';
import { ActualizarCensoDto } from './dto/actualizar-censo.dto';
import { CambiarEstadoCensoDto } from './dto/cambiar-estado-censo.dto';

@Controller('censos')
export class CensosController {
  constructor(private readonly service: CensosService) {}

  @Post()
  crear(@Body() datos: CrearCensoDto) {
    return this.service.crear(datos);
  }

  // GET /censos?anio=2026&estado=Abierto
  @Get()
  obtenerTodos(
    @Query('anio', new ParseIntPipe({ optional: true })) anio?: number,
    @Query('estado') estado?: string,
  ) {
    return this.service.obtenerTodos(anio, estado);
  }

  // GET /censos/:id/avance  (más específica: va antes que ':id')
  @Get(':id/avance')
  avance(@Param('id') id: string) {
    return this.service.avance(id);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  // PATCH /censos/:id/estado   { "estado": "Abierto" }
  @Patch(':id/estado')
  cambiarEstado(@Param('id') id: string, @Body() datos: CambiarEstadoCensoDto) {
    return this.service.cambiarEstado(id, datos.estado);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: ActualizarCensoDto) {
    return this.service.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
