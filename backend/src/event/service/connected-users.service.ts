import { Injectable } from '@nestjs/common'
import { ConnectedUser } from '../event.type'
import { AuthenticatedUser } from '../../user/user.type'
import { Socket } from 'socket.io'

@Injectable()
export class ConnectedUsersService {
  private connectedUsers: ConnectedUser[] = []

  connect(user: AuthenticatedUser, client: Socket) {
    let item = this.connectedUsers.find(cu => cu.userId === user.id)

    if (!item) {
      item = {userId: user.id, clientIds: []}
      this.connectedUsers.push(item)
    }

    if (!item.clientIds.includes(client.id))
      item.clientIds.push(client.id)
  }

  disconnect(user: AuthenticatedUser, client: Socket) {
    const item = this.connectedUsers.find(cu => cu.userId === user.id)

    if (!item)
      return

    item.clientIds.slice(item.clientIds.indexOf(client.id), 1)
  }

  getAllConnectionsOfUser(user: AuthenticatedUser): string[] {
    return (this.connectedUsers.find(cu => cu.userId === user.id) ?? {clientIds: []} as ConnectedUser).clientIds
  }
}