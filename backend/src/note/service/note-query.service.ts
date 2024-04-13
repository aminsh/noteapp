import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Note } from '../schema/note'
import { Model } from 'mongoose'
import { NoteView } from '../dto/note.view'
import { noteAssembler } from '../dto/note-assembler'

@Injectable()
export class NoteQueryService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
  ) {
  }

  async findOne(id: string): Promise<NoteView> {
    const entity = await this.noteModel.findOne({_id: id})
      .populate('owner')
      .populate('attachments')
      .populate({path: 'shared', populate: {path: 'user'}})

    return noteAssembler(entity)
  }
}