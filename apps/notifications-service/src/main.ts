import { NestFactory } from '@nestjs/core';
import { NotificationsServiceModule } from './notifications-service.module';
import { Logger } from 'nestjs-pino';
import { startTracing } from '@app/common';

async function bootstrap() {
  await startTracing('notifications-service');

  const app = await NestFactory.create(NotificationsServiceModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  // no HTTP port needed, but Nest will still start; keep for health in future
  await app.listen(0);
}
bootstrap();
