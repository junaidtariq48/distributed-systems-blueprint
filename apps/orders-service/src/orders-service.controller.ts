import { Body, Controller, Post } from '@nestjs/common';
import { NatsClient } from './nats.client';

@Controller('orders')
export class OrdersServiceController {
  constructor(private readonly nats: NatsClient) {}

  @Post()
  async create(@Body() body: { userId: string; sku: string; qty: number }) {
    const order = {
      id: `ord_${Date.now()}`,
      userId: body.userId,
      sku: body.sku,
      qty: body.qty,
      createdAt: new Date().toISOString(),
    };

    // publish async event
    await this.nats.publish('orders.created', order);

    return { ok: true, order };
  }
}
