import { BehaviorSubject } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { NotifyTo } from '../event.type'

@Injectable()
export class SubjectService {
  notifyToSubject$ = new BehaviorSubject<NotifyTo>(null)
}
