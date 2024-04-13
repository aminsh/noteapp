import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { NoteService } from '../service/note.service'
import { NoteCreateRequest, NoteRemoveRequest, NoteUpdateRequest } from '../note.constants'
import { NoteDto } from '../dto/note.dto'
import { Identity } from '../../shared/type'

@Controller()
export class NoteMessageController {
  constructor(
    private noteService: NoteService,
  ) {
  }

  @MessagePattern(NoteCreateRequest)
  create(@Payload('body') dto: NoteDto) {
    return this.noteService.create(dto)
  }

  @MessagePattern(NoteUpdateRequest)
  update(@Payload('body') {id, ...dto}: NoteDto & Identity) {
    return this.noteService.update(id, dto)
  }

  @MessagePattern(NoteRemoveRequest)
  remove(@Payload('body') {id}: Identity) {
    return this.noteService.remove(id)
  }
}
