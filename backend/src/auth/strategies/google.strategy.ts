import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-jwt';
import envVariables from '../../common/envVariables';
////ss
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: envVariables.google.clientId, // These should be provided as environment variables
      clientSecret: envVariables.google.clientSecret, // These should be provided as environment variables
      callbackURL: envVariables.google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, username } = profile;
    const user = {
      email: emails[0].value,
      username: username || emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user as any);
  }
}
