import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() body) {
    return this.auth.signup(body.username, body.password);
  }

  @Post('login')
  login(@Body() body) {
    return this.auth.login(body.username, body.password);
  }
}