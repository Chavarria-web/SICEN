import {
  Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Put, Query,
} from '@nestjs/common';
import { EnviosCensoService } from './envios-censo.service';
import { CrearEnvioCensoDto } from './dto/crear-envio-censo.dto';
import { GuardarRespuestasDto } from './dto/guardar-respuestas.dto';
import { AccionEnvioDto, DevolverEnvioDto } from './dto/acciones-envio.dto';

@Controller('envios-censo')
export class EnviosCensoController {
  constructor(private readonly service: EnviosCensoService) {}

  @Post()
  crear(@Body() datos: CrearEnvioCensoDto) {
    return this.service.crear(datos);
  }

  // GET /envios-censo?censo=<id>&estado=Enviado&pagina=1&limite=50
  @Get()
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(50), ParseIntPipe) limite: number,
    @Query('censo') censo?: string,
    @Query('centroEducativo') centroEducativo?: string,
    @Query('estado') estado?: string,
  ) {
    return this.service.listar(pagina, limite, censo, centroEducativo, estado);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  // PUT /envios-censo/:id/respuestas  (reemplaza las respuestas guardadas)
  @Put(':id/respuestas')
  guardarRespuestas(@Param('id') id: string, @Body() datos: GuardarRespuestasDto) {
    return this.service.guardarRespuestas(id, datos);
  }

  @Patch(':id/enviar')
  enviar(@Param('id') id: string, @Body() datos: AccionEnvioDto) {
    return this.service.enviar(id, datos.usuario, datos.observacion);
  }

  @Patch(':id/devolver')
  devolver(@Param('id') id: string, @Body() datos: DevolverEnvioDto) {
    return this.service.devolver(id, datos.usuario, datos.motivoDevolucion);
  }

  @Patch(':id/aceptar')
  aceptar(@Param('id') id: string, @Body() datos: AccionEnvioDto) {
    return this.service.aceptar(id, datos.usuario, datos.observacion);
  }
}
