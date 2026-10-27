import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CentroEducativo, CentroEducativoSchema } from './schemas/centro-educativo.schema';
import { OfertaEducativa, OfertaEducativaSchema } from '../ofertas-educativas/schemas/oferta-educativa.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { CentrosEducativosController } from './centros-educativos.controller';
import { CentrosEducativosService } from './centros-educativos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CentroEducativo.name, schema: CentroEducativoSchema },
      { name: OfertaEducativa.name, schema: OfertaEducativaSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [CentrosEducativosController],
  providers: [CentrosEducativosService],
})
export class CentrosEducativosModule {}
