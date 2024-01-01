import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getEnv } from './utils/config/get-env';
import * as fs from 'fs';

async function bootstrap() {
  const { port, https } = getEnv();

  const app = await NestFactory.create(
    AppModule,
    https
      ? {
          httpsOptions: {
            key: fs.readFileSync('/app/certificates/key.pem'),
            cert: fs.readFileSync('/app/certificates/cert.pem'),
          },
        }
      : {},
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(port);
}
bootstrap();
