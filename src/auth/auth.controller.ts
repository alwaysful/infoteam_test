import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OAuthUserDto } from './dto/oauthlogin.dto';
import { CreateUserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@Controller('auth')
export class AuthController {
  authService: any;
  constructor(private auth: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ type: UserResponseDto })
  signup(@Body() body: CreateUserDto) {
    return this.auth.signup(body.email, body.password, body.username);
  }

  @Post('login')
  @ApiCreatedResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }

  @Post('oauth')
  @ApiCreatedResponse({ type: TokenResponseDto })
  oauthLogin(@Body() oauthUser: OAuthUserDto) {
    return this.authService.oauthLogin(oauthUser);
  }

  @Get('infoteam')
  @UseGuards(AuthGuard('infoteam'))
  async infoteamLogin() {
    // redirect to infoteam login page
  }

  @Get('infoteam/callback')
  @ApiOkResponse({ type: TokenResponseDto })
  @UseGuards(AuthGuard('infoteam'))
  async infoteamCallback(@Req() req: { user: OAuthUserDto }) {
    return this.auth.oauthLogin(req.user);
  }
}
