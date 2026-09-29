import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OAuthUserDto } from './dto/oauthlogin.dto';
import { CreateUserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.auth.signup(body.username, body.password);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body.username, body.password);
  }

  @Post('oauth')
  oauthLogin(@Body() oauthUser: OAuthUserDto) {
    return this.authService.oauthLogin(oauthUser);
  }

  @Get('infoteam')
  @UseGuards(AuthGuard('infoteam'))
  async infoteamLogin() {
    // redirect to infoteam login page
  }

  @Get('infoteam/callback')
  @UseGuards(AuthGuard('infoteam'))
  async infoteamCallback(@Req() req: { user: OAuthUserDto }) {
    return this.auth.oauthLogin(req.user);
  }
}
