import { Socket } from 'socket.io-client'

export type SocketContextProps = {
  socket: Socket | undefined
}