import { Controller } from '@nestjs/common'
import { NoteQueryService } from '../../note/service/note-query.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { NoteChangeEvent } from '../../note/note.constants'
import { MessagePayload } from '../../shared/type/message'
import { Identity } from '../../shared/type'
import { SubjectService } from '../service/subject.service'

@Controller()
export class NoteEventController {
  constructor(
    private noteQuery: NoteQueryService,
    private subjectService: SubjectService,
  ) {
  }

  @MessagePattern(NoteChangeEvent)
  async onChange(@Payload() payload: MessagePayload<Identity>) {
    const {user} = payload.headers
    const {body} = payload
    const view = await this.noteQuery.findOne(body.id)
    const to = [
      view.owner,
      ...view.shared.map(sh => sh.user)
    ]
      .filter(u =>u.id !== user.id)

    this.subjectService.notifyToSubject$.next({
      message: NoteChangeEvent,
      body: view,
      to,
    })
  }
}