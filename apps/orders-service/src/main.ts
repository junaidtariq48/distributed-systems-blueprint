import { NestFactory } from '@nestjs/core';
import { OrdersServiceModule } from './orders-service.module';
import { Logger } from 'nestjs-pino';
import { startTracing } from '@app/common';

async function bootstrap() {
  await startTracing('orders-service');

  const app = await NestFactory.create(OrdersServiceModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const port = Number(process.env.ORDERS_SERVICE_PORT || 3003);
  await app.listen(port);
}
bootstrap();
