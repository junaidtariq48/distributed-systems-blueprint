import { Module } from '@nestjs/common';
import { buildLogger } from '@app/common/logger';
import { UsersServiceController } from './users-service.controller';

@Module({
  imports: [buildLogger('user-service')],
  controllers: [UsersServiceController],
  providers: [],
})
export class UsersServiceModule {}
