import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Censo, CensoSchema } from './schemas/censo.schema';
import { Formulario, FormularioSchema } from '../formularios/schemas/formulario.schema';
import { OfertaEducativa, OfertaEducativaSchema } from '../ofertas-educativas/schemas/oferta-educativa.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { EnvioCenso, EnvioCensoSchema } from '../envios-censo/schemas/envio-censo.schema';
import { CensosController } from './censos.controller';
import { CensosService } from './censos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Censo.name, schema: CensoSchema },
      { name: Formulario.name, schema: FormularioSchema },
      { name: OfertaEducativa.name, schema: OfertaEducativaSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: EnvioCenso.name, schema: EnvioCensoSchema },
    ]),
  ],
  controllers: [CensosController],
  providers: [CensosService],
})
export class CensosModule {}
