import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      // transformOptions: { excludeExtraneousValues: true },
    }),
  );
  app.useBodyParser('json', { limit: '50mb' });
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const config = new DocumentBuilder()
    .setTitle('LMS')
    .setDescription('This is a Learning Management System.')
    .setVersion('1.0')
    .addTag('elearning')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
