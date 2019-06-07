import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule))
    .use(compression())
    .use(helmet());

  await app.listen(3000);
}
bootstrap();
