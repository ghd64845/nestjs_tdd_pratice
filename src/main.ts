import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationFailException } from '@src/components/exception/validationFail.exception';

async function bootstrap() {
  try
  {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3001;
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (validationError: ValidationError[] =[]) => {
          return new ValidationFailException(validationError);
        }
      })
    );

    app.enableCors({
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
    });

    await app.listen(port);
  }
  catch(err)
  {
    console.log(err);
  }
}
bootstrap();
