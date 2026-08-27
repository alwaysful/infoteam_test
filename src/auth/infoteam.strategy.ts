import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfoTeamStrategy extends PassportStrategy(Strategy, 'infoteam') {
  constructor(config: ConfigService) {
    super({
      authorizationURL: '인포팀_AUTH_URL',
      tokenURL: '인포팀_TOKEN_URL',
      clientID: config.get<string>('INFOTEAM_CLIENT_ID') as string,
      clientSecret: config.get<string>('INFOTEAM_CLIENT_SECRET') as string,
      callbackURL: 'http://localhost:3000/auth/infoteam/callback',
      scope: ['profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      provider: 'infoteam',
      providerId: profile.id,
      email: profile.email,
    };
  }
}