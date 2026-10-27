import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OAuthUserDto } from './dto/oauthlogin.dto';
import { CreateUserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '로컬 회원가입' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  signup(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.auth.signup(body.email, body.password, body.username);
  }

  @Post('login')
  @ApiOperation({ summary: '로컬 로그인 (JWT 발급)' })
  @ApiCreatedResponse({ type: TokenResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  login(@Body() body: LoginDto): Promise<TokenResponseDto> {
    return this.auth.login(body.email, body.password);
  }

  @Post('oauth')
  @ApiOperation({ summary: 'OAuth 사용자 로그인 (없으면 가입 후 JWT 발급)' })
  @ApiCreatedResponse({ type: TokenResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  oauthLogin(@Body() oauthUser: OAuthUserDto): Promise<TokenResponseDto> {
    return this.auth.oauthLogin(oauthUser);
  }

  @Get('infoteam')
  @ApiOperation({ summary: 'InfoTeam 로그인 페이지로 리다이렉트' })
  @ApiResponse({ status: 302, description: 'InfoTeam 로그인 페이지로 이동' })
  @UseGuards(AuthGuard('infoteam'))
  infoteamLogin(): void {
    // Guard가 InfoTeam 로그인 페이지로 리다이렉트한다
  }

  @Get('infoteam/callback')
  @ApiOperation({ summary: 'InfoTeam OAuth 콜백 (JWT 발급)' })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiServiceUnavailableResponse({
    type: ErrorResponseDto,
    description: '인증 서버(IDP)와 통신할 수 없음',
  })
  @UseGuards(AuthGuard('infoteam'))
  infoteamCallback(
    @Req() req: { user: OAuthUserDto },
  ): Promise<TokenResponseDto> {
    return this.auth.oauthLogin(req.user);
  }
}
