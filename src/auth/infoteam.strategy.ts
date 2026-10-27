import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { OAuthUserDto } from './dto/oauthlogin.dto';

@Injectable()
export class InfoTeamStrategy extends PassportStrategy(Strategy, 'infoteam') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      authorizationURL: config.getOrThrow<string>('INFOTEAM_AUTH_URL'),
      tokenURL: config.getOrThrow<string>('INFOTEAM_TOKEN_URL'),
      clientID: config.getOrThrow<string>('INFOTEAM_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('INFOTEAM_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('INFOTEAM_CALLBACK_URL'),
      scope: ['profile'],
    });
  }

  // passport-oauth2는 프로필을 조회하지 않고 validate(accessToken, refreshToken, ...)로 호출된다.
  // 따라서 accessToken으로 IDP userinfo를 직접 조회한다.
  async validate(accessToken: string): Promise<OAuthUserDto> {
    const { id, email } = await this.authService.getUserInfo(accessToken);

    if (!id || !email) {
      throw new UnauthorizedException('IDP에서 사용자 정보를 받지 못했습니다.');
    }

    return { provider: 'infoteam', providerId: id, email };
  }
}
