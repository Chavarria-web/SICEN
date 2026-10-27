import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import { CrearGestionDto } from './dto/crear-gestion.dto';

@Controller('gestiones')
export class GestionesController {
  constructor(private readonly service: GestionesService) {}

  @Post()
  crear(@Body() datos: CrearGestionDto) {
    return this.service.crear(datos);
  }

  // GET /gestiones/envio/:envioId
  @Get('envio/:envioId')
  porEnvio(@Param('envioId') envioId: string) {
    return this.service.porEnvio(envioId);
  }
}
