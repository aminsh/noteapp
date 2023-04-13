import { Note } from '../schema/note';
import { NoteDto } from '../dto/note.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteRepository } from '../repository/note.repository';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async create(dto: NoteDto): Promise<Note> {
    const entity = new Note();
    entity.title = dto.title;
    entity.content = dto.content;

    return this.noteRepository.create(entity);
  }


  async update(_id: string, dto: NoteDto): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id });

    if (!entity)
      throw new NotFoundException();

    entity.title = dto.title;
    entity.content = dto.content;

    await this.noteRepository.update(entity);
  }

  async remove(_id: string): Promise<void> {
    const entity = await this.noteRepository.findOne({ _id });

    if (!entity)
      throw new NotFoundException();

    await this.noteRepository.remove(entity);
  }
}
