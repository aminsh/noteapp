import { InjectModel } from '@nestjs/mongoose';
import { Note } from '../schema/note';
import { Model } from 'mongoose';
import { NoteDto } from '../dto/note.dto';
import { Injectable } from '@nestjs/common';
import { NoteView } from '../dto/note.view';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(dto: NoteDto): Promise<Note> {
    const entity = new this.noteModel(dto);
    return entity.save();
  }

  async find(): Promise<NoteView[]> {
    const entities = await this.noteModel.find().exec();
    return entities.map(e => ({
      id: e._id.toString(),
      title: e.title,
      content: e.content
    }))
  }
}
