import { NestFactory } from '@nestjs/core';
import { UsersServiceModule } from './users-service.module';
import { Logger } from 'nestjs-pino';
import { startTracing } from '@app/common';

async function bootstrap() {
  await startTracing('users-service');

  const app = await NestFactory.create(UsersServiceModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const port = Number(process.env.USERS_SERVICE_PORT || 3002);
  await app.listen(port);
}
bootstrap();
