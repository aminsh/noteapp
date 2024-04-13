import { Observable } from 'rxjs'
import { AuthenticatedUser } from '../../user/user.type'

export interface MessagePayload<TBody> {
  headers: {user: AuthenticatedUser}
  body: TBody
}

export interface MessageService {
  send<TResult, TBody>(pattern: string, payload: MessagePayload<TBody>): Observable<TResult>

  emit<TBody>(pattern: string, payload: MessagePayload<TBody>): void
}