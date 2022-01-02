import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as session from 'express-session';

import { envConfigService } from '@src/config/evn.config';
import { databaseConfigService } from '@src/config/typeorm.config'

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(databaseConfigService.getTypeOrmConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  constructor(){}
  configure(consumer: MiddlewareConsumer) {
    const sessionSecret = envConfigService.getSessionSecret();
    consumer
    .apply(
      session({
        secret: sessionSecret,
        saveUninitialized: true,
        resave: false,
        rolling: true,
        cookie: {
          domain: envConfigService.getCookieDomain(),
          maxAge: 60 * 60 * 24 * 31 * 1000
        },
        unset: 'destroy'
      })
    )
    .forRoutes('*');
  }
}
