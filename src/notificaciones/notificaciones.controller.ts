import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CrearNotificacionDto } from './dto/crear-notificacion.dto';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly service: NotificacionesService) {}

  @Post()
  crear(@Body() datos: CrearNotificacionDto) {
    return this.service.crear(datos);
  }

  // GET /notificaciones/destinatario/:id?soloNoLeidas=true&limite=20
  @Get('destinatario/:id')
  porDestinatario(
    @Param('id') id: string,
    @Query('soloNoLeidas') soloNoLeidas?: string,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite = 20,
  ) {
    return this.service.porDestinatario(id, soloNoLeidas === 'true', limite);
  }

  // GET /notificaciones/destinatario/:id/no-leidas
  @Get('destinatario/:id/no-leidas')
  contarNoLeidas(@Param('id') id: string) {
    return this.service.contarNoLeidas(id);
  }

  // PATCH /notificaciones/destinatario/:id/leer-todas
  @Patch('destinatario/:id/leer-todas')
  marcarTodasLeidas(@Param('id') id: string) {
    return this.service.marcarTodasLeidas(id);
  }

  // PATCH /notificaciones/:id/leer
  @Patch(':id/leer')
  marcarLeida(@Param('id') id: string) {
    return this.service.marcarLeida(id);
  }
}
