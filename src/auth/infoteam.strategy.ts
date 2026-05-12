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
      clientID: config.get('INFOTEAM_CLIENT_ID'),
      clientSecret: config.get('INFOTEAM_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/infoteam/callback',
      scope: ['profile'],
    });
  }

  //서비스ID: 38e209cc-b0d4-4e31-bf42-0154fef66144
  //서비스비번: TdaAs8sxHcxJ2stfPjIKOf0sFEyru0aNf1BwVHKsfs

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      provider: 'infoteam',
      providerId: profile.id,
      email: profile.email,
    };
  }
}