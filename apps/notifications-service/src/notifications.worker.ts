import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, StringCodec, Subscription } from 'nats';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class NotificationsWorker implements OnModuleInit, OnModuleDestroy {
  private nc!: NatsConnection;
  private sub!: Subscription;
  private sc = StringCodec();

  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(NotificationsWorker.name);
  }

  async onModuleInit() {
    this.nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });

    this.sub = this.nc.subscribe('orders.created');
    (async () => {
      for await (const msg of this.sub) {
        const payload = JSON.parse(this.sc.decode(msg.data));
        this.logger.info({ payload }, 'Received orders.created -> sending notification');
        // Demo action: pretend to send email/SMS
      }
    })();
  }

  async onModuleDestroy() {
    this.sub?.unsubscribe();
    await this.nc?.drain();
  }
}
