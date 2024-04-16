import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { HttpStatus, Inject, UseFilters, UseGuards } from '@nestjs/common'
import { WsGuard } from '../guard/ws.guard'
import { Server, Socket } from 'socket.io'
import { AuthenticatedUser } from '../../user/user.type'
import { WebsocketPayload } from '../event.type'
import { MESSAGE_SERVICE } from '../../shared/shared.contacts'
import { MessageService } from '../../shared/type/message'
import { SubjectService } from '../service/subject.service'
import { ConnectedUsersService } from '../service/connected-users.service'
import { UserService } from '../../user/service/user.service'
import { exceptionResponseHandler, WsExceptionFilter } from '../filter/ws-exception.filter'

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    allowedHeaders: '*',
    origin: '*',
    credentials: false,
  },
})
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(MESSAGE_SERVICE) private message: MessageService,
    private subjectService: SubjectService,
    private connectedUsers: ConnectedUsersService,
    private userService: UserService,
  ) {
  }

  @WebSocketServer() io: Server

  afterInit() {
    this.subjectService.notifyToSubject$.subscribe(value => {
      if (!value)
        return

      const {message, to, body} = value

      return Promise.all(
        to.map(user => this.emit(user.id, message, body)),
      )
    })
  }

  async handleConnection(client: Socket) {
    const auth = client.handshake.auth

    const {token} = auth

    try {
      const user = this.userService.verify(token)

      this.connectedUsers.connect(user._id, client.id)
    } catch {
      exceptionResponseHandler({
        status: HttpStatus.UNAUTHORIZED,
        client,
      })
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket): any {
    this.connectedUsers.disconnect(client.id)
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('request')
  request({user}: Socket & { user: AuthenticatedUser }, payload: WebsocketPayload) {
    if (typeof payload === 'string')
      payload = JSON.parse(payload)

    return this.message.send(payload.message, {
      headers: {user},
      body: payload.body,
    })
  }

  private async emit(userId: string, message: string, body?: any): Promise<void> {
    const allSockets = await this.io.fetchSockets()
    const socketIds = this.connectedUsers.getUserClients(userId)
    const sockets = allSockets.filter(socket => socketIds.includes(socket.id))
    sockets.forEach(socket => {
      socket.emit(message, body)
    })
  }
}