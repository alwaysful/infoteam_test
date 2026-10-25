import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';

@Injectable()
export class InfoTeamStrategy extends PassportStrategy(Strategy, 'infoteam') {
  constructor(config: ConfigService) {
    super({
      authorizationURL: config.getOrThrow<string>('INFOTEAM_AUTH_URL'),
      tokenURL: config.getOrThrow<string>('INFOTEAM_TOKEN_URL'),
      clientID: config.getOrThrow<string>('INFOTEAM_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('INFOTEAM_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/infoteam/callback',
      scope: ['profile'],
    });
  }

  validate(profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error('Email not provided');
    }

    return {
      provider: 'infoteam',
      providerId: profile.id,
      email,
    };
  }
}
