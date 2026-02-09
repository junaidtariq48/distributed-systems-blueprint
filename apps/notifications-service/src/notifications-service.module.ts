import { Module } from '@nestjs/common';
import { buildLogger } from '@app/common/logger';
import { NotificationsWorker } from './notifications.worker';

@Module({
  imports: [buildLogger('notification-service')],
  providers: [NotificationsWorker],
})
export class NotificationsServiceModule {}
