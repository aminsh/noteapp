import { Injectable } from '@nestjs/common'
import { ConnectedUser } from '../event.type'

@Injectable()
export class ConnectedUsersService {
  private connectedUsers: ConnectedUser[] = []

  connect(userId: string ,clientId: string) {
    const item = this.connectedUsers.find(cu => cu.userId === userId && cu.clientId === clientId)

    if(item)
      return

    this.connectedUsers.push({userId, clientId})
  }

  disconnect(clientId: string) {
    const item = this.connectedUsers.find(cu => cu.clientId === clientId)

    if (!item)
      return

    this.connectedUsers.splice(this.connectedUsers.indexOf(item), 1)
  }

  getUserClients(userId: string): string[] {
    return this.connectedUsers.filter(cu => cu.userId === userId).map(cu => cu.clientId)
  }
}