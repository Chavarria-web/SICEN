import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OfertasEducativasModule } from './ofertas-educativas/ofertas-educativas.module';
import { CentrosEducativosModule } from './centros-educativos/centros-educativos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FormulariosModule } from './formularios/formularios.module';
import { CensosModule } from './censos/censos.module';
import { EnviosCensoModule } from './envios-censo/envios-censo.module';
import { GestionesModule } from './gestiones/gestiones.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

@Module({
  imports: [
    // Lee el archivo .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB Atlas
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // Un módulo por entidad del diagrama (de las independientes a las dependientes)
    OfertasEducativasModule,
    CentrosEducativosModule,
    UsuariosModule,
    FormulariosModule,
    CensosModule,
    EnviosCensoModule,
    GestionesModule,
    NotificacionesModule,
  ],
})
export class AppModule {}
