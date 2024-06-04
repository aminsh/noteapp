import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { File } from '../../shared/schema/file'

@Schema()
export class NoteImageContent {
  @Prop([ { type: mongoose.Schema.Types.ObjectId, ref: File.name } ])
  images: File[]
}

export const NoteImageContentSchema = SchemaFactory.createForClass(NoteImageContent)