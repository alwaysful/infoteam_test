import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  //아직 못받음

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): { email: string; name: string } {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Email not provided');
    }

    return { email, name: profile.displayName };
  }
}
