import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OfertasEducativasService } from './ofertas-educativas.service';
import { CrearOfertaEducativaDto } from './dto/crear-oferta-educativa.dto';
import { ActualizarOfertaEducativaDto } from './dto/actualizar-oferta-educativa.dto';

@Controller('ofertas-educativas')
export class OfertasEducativasController {
  constructor(private readonly service: OfertasEducativasService) {}

  @Post()
  crear(@Body() datos: CrearOfertaEducativaDto) {
    return this.service.crear(datos);
  }

  // GET /ofertas-educativas?soloActivas=true
  @Get()
  obtenerTodas(@Query('soloActivas') soloActivas?: string) {
    return this.service.obtenerTodas(soloActivas === 'true');
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: ActualizarOfertaEducativaDto) {
    return this.service.actualizar(id, datos);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
