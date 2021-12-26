import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { RedisClient } from 'redis';

import { envConfigService } from '@src/config/evn.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
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
