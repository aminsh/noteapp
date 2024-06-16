import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { google } from 'googleapis'
import base64url from 'base64url'
import { AuthenticationRepository } from '../repository/authentication.repository'
import { Authentication } from '../schema/authentication'
import { User } from '../../user/shema/user'

@Injectable()
export class GoogleAuthService {
  constructor(
    private configService: ConfigService,
    private authenticationRepository: AuthenticationRepository,
  ) {
  }

  get client() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID')
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET')
    const redirectUri = this.configService.get('GOOGLE_CALLBACK_URL')

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  }

  getUrl(userId: string): any {
    const scopes = ['email', 'https://www.googleapis.com/auth/drive']

    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      state: base64url.encode(userId),
    })
  }

  async callback(code: string, state: string) {
    const userId = base64url.decode(state)
    const client = this.client

    const {tokens} = await client.getToken(code)

    let auth = await this.authenticationRepository.findOne({
      user: {
        _id: userId,
      },
    })

    if (!auth) {
      const creatAuth = new Authentication()
      creatAuth.user = {
        _id: userId
      } as User
      auth = await this.authenticationRepository.create(creatAuth)
    }

    auth.token = tokens.access_token
    auth.refreshToken = tokens.refresh_token
    await this.authenticationRepository.update(auth)
  }
}