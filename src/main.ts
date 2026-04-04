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
        const extractMessages = (
          errors: import('class-validator').ValidationError[],
        ): string[] =>
          errors.flatMap((error) => [
            ...Object.values(error.constraints ?? {}),
            ...extractMessages(error.children ?? []),
          ]);

        return new HttpException(
          { status: HttpStatus.BAD_REQUEST, messages: extractMessages(errors) },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(appConfigValues.port);

  logger.log(`Gateway running at ${await app.getUrl()}`);
}

void bootstrap();
