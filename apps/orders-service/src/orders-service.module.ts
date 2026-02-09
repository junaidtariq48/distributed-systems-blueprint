import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { buildLogger } from '@app/common/logger';
import { OrdersServiceController } from './orders-service.controller';
import { HealthController } from './health.controller';
import { NatsClient } from './nats.client';

@Module({
  imports: [buildLogger('order-service'), TerminusModule],
  controllers: [OrdersServiceController, HealthController],
  providers: [NatsClient],
})
export class OrdersServiceModule {}
