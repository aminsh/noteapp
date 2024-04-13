import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Inject, UseGuards } from '@nestjs/common'
import { WsGuard } from '../guard/ws.guard'
import { Server, Socket } from 'socket.io'
import { AuthenticatedUser } from '../../user/user.type'
import { WebsocketPayload } from '../event.type'
import { MESSAGE_SERVICE } from '../../shared/shared.contacts'
import { MessageService } from '../../shared/type/message'
import { SubjectService } from '../service/subject.service'

@WebSocketGateway({
  cors: {
    allowedHeaders: '*',
    origin: '*',
    credentials: false,
  },
})
export class MainGateway implements OnGatewayInit {
  constructor(
    @Inject(MESSAGE_SERVICE) private message: MessageService,
    private subjectService: SubjectService,
  ) {
  }

  @WebSocketServer() io: Server

  afterInit(server: Server) {
    this.subjectService.notifyToSubject$.subscribe(value => {
    })
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('request')
  request({user, ...socket}: Socket & { user: AuthenticatedUser }, payload: WebsocketPayload) {
    if (typeof payload === 'string')
      payload = JSON.parse(payload)

    return this.message.send(payload.message, {
      headers: {user},
      body: payload.body,
    })
  }
}