import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OfertaEducativa, OfertaEducativaSchema } from './schemas/oferta-educativa.schema';
import { CentroEducativo, CentroEducativoSchema } from '../centros-educativos/schemas/centro-educativo.schema';
import { OfertasEducativasController } from './ofertas-educativas.controller';
import { OfertasEducativasService } from './ofertas-educativas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OfertaEducativa.name, schema: OfertaEducativaSchema },
      { name: CentroEducativo.name, schema: CentroEducativoSchema },
    ]),
  ],
  controllers: [OfertasEducativasController],
  providers: [OfertasEducativasService],
})
export class OfertasEducativasModule {}
