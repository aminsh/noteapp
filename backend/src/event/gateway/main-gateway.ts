import { MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { UseGuards } from '@nestjs/common'
import { JwtHttpAuthenticationGuard } from 'dx-nest-core/auth'

@WebSocketGateway({
  cors: {
    allowedHeaders: '*',
    origin: '*',
    credentials: false,
  },
})
export class MainGateway {
  @UseGuards(JwtHttpAuthenticationGuard)
  @SubscribeMessage('create')
  onCreate(@MessageBody() data: any) {
    return data
  }

  @SubscribeMessage('health-check')
  healthCheck(): string {
    return 'OK'
  }
}