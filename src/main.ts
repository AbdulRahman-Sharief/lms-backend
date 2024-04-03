import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: process.env.ORIGIN,
    },
    rawBody: true,
  });
  app.useBodyParser('json', { limit: '50mb' });
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
