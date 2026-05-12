import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('infoteam')
  @UseGuards(AuthGuard('infoteam'))
  async infoteamLogin() {
    // redirect to infoteam login page
  }

  @Get('infoteam/callback')
  @UseGuards(AuthGuard('infoteam'))
  async infoteamCallback(@Req() req) {
  return this.auth.oauthLogin(req.user);
  }
}