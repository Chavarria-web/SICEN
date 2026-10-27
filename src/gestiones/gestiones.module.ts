import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gestion, GestionSchema } from './schemas/gestion.schema';
import { EnvioCenso, EnvioCensoSchema } from '../envios-censo/schemas/envio-censo.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { GestionesController } from './gestiones.controller';
import { GestionesService } from './gestiones.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gestion.name, schema: GestionSchema },
      { name: EnvioCenso.name, schema: EnvioCensoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [GestionesController],
  providers: [GestionesService],
})
export class GestionesModule {}
