import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formulario, FormularioSchema } from './schemas/formulario.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { Censo, CensoSchema } from '../censos/schemas/censo.schema';
import { FormulariosController } from './formularios.controller';
import { FormulariosService } from './formularios.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formulario.name, schema: FormularioSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Censo.name, schema: CensoSchema },
    ]),
  ],
  controllers: [FormulariosController],
  providers: [FormulariosService],
})
export class FormulariosModule {}
