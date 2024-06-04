import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { File } from '../../shared/schema/file'

@Schema()
export class NoteFileContent {
  @Prop([ { type: mongoose.Schema.Types.ObjectId, ref: File.name } ])
  files: File[]
}

export const NoteFileContentSchema = SchemaFactory.createForClass(NoteFileContent)