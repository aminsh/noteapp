import * as Enumerable from 'linq'
import { Note } from '../schema/note'
import { NoteDto } from '../dto/note.dto'
import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common'
import { NoteRepository } from '../repository/note.repository'
import { UserRepository } from '../../user/repository/user.repository'
import { RequestContext } from '../../shared/service/request-context'
import { FileRepository } from '../../shared/repository/file.repository'
import { File } from '../../shared/schema/file'
import { NOTE_MESSAGE } from '../note.constants'
import { NoteAccess, NoteShared } from '../schema/note-shared'
import { NoteShareDTO } from '../dto/note-shared.dto'

@Injectable({ scope: Scope.REQUEST })
export class NoteService {
  constructor(private noteRepository: NoteRepository,
              private userRepository: UserRepository,
              private requestContext: RequestContext,
              private fileRepository: FileRepository) {}

  async create(dto: NoteDto): Promise<Note> {
    const entity = new Note()
    entity.owner = await this.userRepository.findOne({ _id: this.requestContext.authenticatedUser.id })
    entity.title = dto.title
    entity.content = dto.content

    await this.resolveFiles(dto.attachments, entity)

    return this.noteRepository.create(entity)
  }

  async update(_id: string, dto: NoteDto): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id })

    if (!entity)
      throw new NotFoundException()

    this.isUserAllowedToEdit(entity)

    entity.title = dto.title
    entity.content = dto.content

    await this.resolveFiles(dto.attachments, entity)

    await this.noteRepository.update(entity)
  }

  async remove(_id: string): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id })

    if (!entity)
      throw new NotFoundException()

    await this.noteRepository.remove(entity)
  }

  async share(_id: string, dto: NoteShareDTO[]): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id })

    if (!entity)
      throw new NotFoundException()

    if (Enumerable.from(dto).any(e => e.userId === entity.owner._id.toString()))
      throw new BadRequestException(NOTE_MESSAGE.USER_IS_NOT_ALLOWED_TO_SHARE_A_NOTE_WITH_YOURSELF)

    const users = await this.userRepository.find({
      _id: {
        $in: dto.map(e => e.userId)
      }
    })

    entity.shared = dto.map<NoteShared>(e => ({
      user: users.find(u => u._id.toString() === e.userId),
      access: e.access
    }))

    if (Enumerable.from(entity.shared).any(e => !e.user))
      throw new BadRequestException(NOTE_MESSAGE.ONE_OR_MORE_USERS_ARE_INVALID)

    await this.noteRepository.update(entity)
  }

  private async resolveFiles(filesDto: string[], entity: Note): Promise<void> {
    if (!filesDto?.length)
      return

    const files: File[] = await this.fileRepository.find({
      _id: {
        $in: filesDto
      }
    })

    if (files.length !== filesDto.length)
      throw new BadRequestException(NOTE_MESSAGE.FILES_IS_INVALID)

    entity.attachments = files
  }

  private isUserAllowedToEdit(entity: Note): void {
    const { id: currentUserId } = this.requestContext.authenticatedUser

    if (entity.owner._id.toString() === currentUserId)
      return

    const sharedRecordRelatedToEditorUser = Enumerable
      .from(entity.shared)
      .firstOrDefault(e => e.user._id.toString() === currentUserId)

    if(!(sharedRecordRelatedToEditorUser && sharedRecordRelatedToEditorUser.access === NoteAccess.AllowEdit))
      throw new BadRequestException(NOTE_MESSAGE.THE_CURRENT_USER_IS_NOT_ALLOWED_TO_EDIT_THE_NOTE)
  }
}
