import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthenticatedUser } from '../../user/user.type'

@Injectable()
export class NpRequestContext {
  constructor(
    @Inject(REQUEST) private request: any
  ) {
  }

  private get _request() {
    if (this.request.hasOwnProperty('req'))
      return this.request['req']

    if (this.request.hasOwnProperty('data'))
      return this.request['data']['headers']

    return this.request
  }

  get authenticatedUser(): AuthenticatedUser {
    return {
      id: this._request.user._id,
      email: this._request.user.email
    }
  }
}
