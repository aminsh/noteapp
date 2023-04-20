import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Note } from '../schema/note'
import { FilterQuery, Model, ProjectionType } from 'mongoose'
import { Repository } from '../../shared/type'

@Injectable()
export class NoteRepository implements Repository<Note> {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  find(filter: FilterQuery<Note>, projection?: ProjectionType<Note>): Promise<Note[]> {
    return this.noteModel.find(filter, projection)
  }

  findOne(filter: FilterQuery<Note>, projection?: ProjectionType<Note>): Promise<Note> {
    return this.noteModel.findOne(filter, projection)
  }

  create(entity: Note): Promise<Note> {
    const data = new this.noteModel(entity)
    return data.save()
  }

  async update(entity: Note): Promise<void> {
    await this.noteModel.updateOne({
      _id: entity._id
    }, entity)
  }

  async remove(entity: Note): Promise<void> {
    await this.noteModel.deleteOne({ _id: entity._id })
  }
}
