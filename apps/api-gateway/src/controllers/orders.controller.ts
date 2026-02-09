import {
  Controller,
  Get,
  Headers,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyPublicJwt } from '@app/common';
import { buildInternalHttpClient } from '@app/common';

@Controller('orders')
export class OrdersController {
  private users = buildInternalHttpClient(process.env.USERS_SERVICE_BASE_URL!);
  private orders = buildInternalHttpClient('http://orders-service:3003');

  @Get('me')
  async me(@Headers('authorization') auth?: string) {
    const user = this.requireUser(auth);
    // call users-service (internal, secured)
    return this.users.get<{ id: string; email: string; plan: string }>(`/users/${user.sub}`);
  }

  @Post()
  async createOrder(
    @Headers('authorization') auth?: string,
    @Body() body?: { sku: string; qty: number },
  ) {
    const user = this.requireUser(auth);
    return this.orders.post(`/orders`, { userId: user.sub, ...body });
  }

  private requireUser(auth?: string) {
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();
    const token = auth.slice('Bearer '.length);
    return verifyPublicJwt(token);
  }
}
