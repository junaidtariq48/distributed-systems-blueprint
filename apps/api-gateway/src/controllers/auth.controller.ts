import { Body, Controller, Post } from '@nestjs/common';
import { signPublicJwt } from '@app/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { email: string }) {
    // DEMO ONLY:
    // In a real system, validate password, store users, etc.
    const token = signPublicJwt({ sub: 'user-1', email: body.email });
    return { accessToken: token };
  }
}
