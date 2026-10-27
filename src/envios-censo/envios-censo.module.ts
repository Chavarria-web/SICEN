import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvioCenso, EnvioCensoSchema } from './schemas/envio-censo.schema';
import { Censo, CensoSchema } from '../censos/schemas/censo.schema';
import { CentroEducativo, CentroEducativoSchema } from '../centros-educativos/schemas/centro-educativo.schema';
import { Formulario, FormularioSchema } from '../formularios/schemas/formulario.schema';
import { Gestion, GestionSchema } from '../gestiones/schemas/gestion.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { EnviosCensoController } from './envios-censo.controller';
import { EnviosCensoService } from './envios-censo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnvioCenso.name, schema: EnvioCensoSchema },
      { name: Censo.name, schema: CensoSchema },
      { name: CentroEducativo.name, schema: CentroEducativoSchema },
      { name: Formulario.name, schema: FormularioSchema },
      { name: Gestion.name, schema: GestionSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [EnviosCensoController],
  providers: [EnviosCensoService],
})
export class EnviosCensoModule {}
