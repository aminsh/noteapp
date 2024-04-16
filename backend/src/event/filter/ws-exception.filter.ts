import { Catch, HttpStatus } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  handleError<TClient extends { emit: any }>(client: TClient, exception: { status?: HttpStatus, message: any }) {
    exceptionResponseHandler({
      status: exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      client,
      message: exception.message,
    })
  }
}

export type ExceptionResponseHandlerArgs = {
  status: HttpStatus,
  client: { emit: (event: string, data: any) => void },
  message?: any
}

export const exceptionResponseHandler = ({status, client, message}: ExceptionResponseHandlerArgs) =>
  client.emit('exception', {status, message})