import { Module } from '@nestjs/common';
import { buildLogger } from '@app/common';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';

@Module({
  imports: [buildLogger['user-service']],
  controllers: [UsersServiceController],
  providers: [UsersServiceService],
})
export class UsersServiceModule {}
