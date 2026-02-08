import {
  Controller,
  Get,
  Headers,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyInternalJwt } from '@app/common';

@Controller('users')
export class UsersServiceController {
  @Get(':id')
  getUser(
    @Headers('authorization') auth: string | undefined,
    @Param('id') id: string,
  ) {
    this.requireInternal(auth);

    // Demo response (replace with DB later)
    return {
      id,
      email: 'demo@company.com',
      plan: 'starter',
    };
  }

  private requireInternal(auth?: string) {
    if (!auth?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing internal token');
    const token = auth.slice('Bearer '.length);
    verifyInternalJwt(token);
  }
}
