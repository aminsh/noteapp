import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthenticatedUser } from '../../user/user.type'

@Injectable()
export class RequestContext {
  constructor(@Inject(REQUEST) private request: any) {}

  private get _request() {
    return this.request.hasOwnProperty('req')
      ? this.request['req']
      : this.request
  }

  get authenticatedUser(): AuthenticatedUser {
    return {
      id: this._request.user._id,
      email: this._request.user.email
    }
  }
}
