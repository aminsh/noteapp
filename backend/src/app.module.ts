import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NoteModule } from './note/note.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) => ({ uri: configService.get('MONGO_URI') })
    }),
    NoteModule,
    UserModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {
}
