import { UserView } from '../user/dto/user.view'

export interface WebsocketPayload {
  message: string
  body: any
}

export interface NotifyTo {
  message: string
  body: any
  to: UserView[]
}