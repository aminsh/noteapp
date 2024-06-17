import { PassportStrategy } from '@nestjs/passport'
import base64url from 'base64url'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthenticationRepository } from '../repository/authentication.repository'
import { EqualsCaseInsensitive } from '../../shared/utils'
import { User } from '../../user/shema/user'
import { Authentication } from '../schema/authentication'
import { UserRepository } from '../../user/repository/user.repository'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private authenticationRepository: AuthenticationRepository,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/drive',
      ],
    })
  }

  authenticate(req, options) {
    const callbackURL = req.query['callbackUrl']
    if (callbackURL)
      options.state = base64url.encode(callbackURL.toString())

    super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const email = emails[0].value

    const user: User = await this.userRepository.findOne({
      email: EqualsCaseInsensitive(email),
    })

    if(!user)
      return done(null, null)

    let auth = await this.authenticationRepository.findOne({
      user,
    })

    if(!auth) {
      const creatAuth = new Authentication()
      creatAuth.user = user
      auth = await this.authenticationRepository.create(creatAuth)
    }

    auth.token = accessToken
    await this.authenticationRepository.update(auth)

    done(null, user)
  }
}
