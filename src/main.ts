import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule))
    .use(compression())
    .use(helmet());

  const options = new DocumentBuilder()
    // TODO: read this from package.json
    .setTitle('Gate Connect')
    // TODO: read this from package.json
    .setDescription('The Gate Connect API')
    // TODO: read this from package.json
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('openapi', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
