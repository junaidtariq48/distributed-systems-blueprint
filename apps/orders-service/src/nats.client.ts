import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class NatsClient implements OnModuleInit, OnModuleDestroy {
  private nc!: NatsConnection;
  private sc = StringCodec();

  async onModuleInit() {
    this.nc = await connect({
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
  }

  async publish(subject: string, payload: unknown) {
    const data = this.sc.encode(JSON.stringify(payload));
    this.nc.publish(subject, data);
  }

  async onModuleDestroy() {
    await this.nc?.drain();
  }
}
