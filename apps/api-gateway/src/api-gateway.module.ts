import { Module } from '@nestjs/common';
import { buildLogger } from '@app/common';
import { AuthController } from './controllers/auth.controller';
import { OrdersController } from './controllers/orders.controller';
import { ApiGatewayService } from './api-gateway.service';

@Module({
  imports: [buildLogger['api-gateway']],
  controllers: [AuthController, OrdersController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
