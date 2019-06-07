import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule))
    .use(compression())
    .use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Gate Connect')
    .setDescription('The Gate Connect API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('openapi', app, document);

  await app.listen(3000);
}
bootstrap();
