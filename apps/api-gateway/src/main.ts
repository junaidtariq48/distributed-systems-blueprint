import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { startTracing } from '@app/common';

async function bootstrap() {
  await startTracing('api-gateway');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const port = Number(process.env.API_GATEWAY_PORT || 3001);
  await app.listen(port);
}
bootstrap();
