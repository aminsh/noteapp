import { Note } from '../schema/note';
import { NoteDto } from '../dto/note.dto';
import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { NoteRepository } from '../repository/note.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { RequestContext } from '../../shared/service/request-context';
import { FileRepository } from '../../shared/repository/file.repository';
import { File } from '../../shared/schema/file';
import { NOTE_MESSAGE } from '../note.constants';

@Injectable({ scope: Scope.REQUEST })
export class NoteService {
  constructor(private noteRepository: NoteRepository,
              private userRepository: UserRepository,
              private requestContext: RequestContext,
              private fileRepository: FileRepository) {}

  async create(dto: NoteDto): Promise<Note> {
    const entity = new Note();
    entity.owner = await this.userRepository.findOne({ _id: this.requestContext.authenticatedUser.id });
    entity.title = dto.title;
    entity.content = dto.content;

    await this.resolveFiles(dto.attachments, entity);

    return this.noteRepository.create(entity);
  }

  async update(_id: string, dto: NoteDto): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id });

    if (!entity)
      throw new NotFoundException();

    entity.title = dto.title;
    entity.content = dto.content;

    await this.resolveFiles(dto.attachments, entity);

    await this.noteRepository.update(entity);
  }

  async remove(_id: string): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id });

    if (!entity)
      throw new NotFoundException();

    await this.noteRepository.remove(entity);
  }

  private async resolveFiles(filesDto: string[], entity: Note): Promise<void> {
    const files: File[] = await this.fileRepository.find({
      _id: {
        $in: filesDto
      }
    });

    if (files.length !== filesDto.length)
      throw new BadRequestException(NOTE_MESSAGE.FILES_IS_INVALID);

    entity.attachments = files;
  }
}
