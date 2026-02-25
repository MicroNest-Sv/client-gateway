import { NestFactory } from '@nestjs/core';
import {
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

import { RpcExceptionFilter } from './common';
import { appConfig } from './config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Gateway');

  const appConfigValues = appConfig();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints ?? {}).join(', '),
        );
        return new HttpException(
          { status: HttpStatus.BAD_REQUEST, messages: messages },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(appConfigValues.port);

  logger.log(`Gateway running on port ${appConfigValues.port}`);
}

void bootstrap();
