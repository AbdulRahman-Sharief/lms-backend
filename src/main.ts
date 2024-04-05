import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: process.env.ORIGIN,
    },
    rawBody: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useBodyParser('json', { limit: '50mb' });
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT);
}
bootstrap();
