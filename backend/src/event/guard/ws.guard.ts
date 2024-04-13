import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { UserService } from '../../user/service/user.service'

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private user: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [{handshake}] = (context as any as { args: { handshake: { auth: { token: string } } }[] }).args
    const {token} = handshake.auth
    const authenticatedUser = this.user.verify(token)
    context.switchToHttp().getRequest().user = authenticatedUser
    return Boolean(authenticatedUser)
  }
}