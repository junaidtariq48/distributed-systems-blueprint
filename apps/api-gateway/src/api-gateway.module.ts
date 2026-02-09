import { Module } from '@nestjs/common';
import { buildLogger } from '@app/common/logger';
import { AuthController } from './controllers/auth.controller';
import { OrdersController } from './controllers/orders.controller';

@Module({
  imports: [buildLogger('api-gateway')],
  controllers: [AuthController, OrdersController],
})
export class ApiGatewayModule {}
