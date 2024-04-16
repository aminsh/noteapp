import { Catch, HttpStatus } from '@nestjs/common'
import { throwError } from 'rxjs'

@Catch()
export class TcpExceptionFilter {
  catch(exception: {status: HttpStatus, message: any}) {
    return throwError({
      status: exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
    })
  }
}