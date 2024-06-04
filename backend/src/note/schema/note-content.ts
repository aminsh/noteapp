import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { NoteTextContent } from './note-text-content'
import { NoteImageContent } from './note-image-content'
import { NoteFileContent } from './note-file-content'

@Schema({_id: false, discriminatorKey: 'type'})
export class NoteContent {
  @Prop({
    type: String,
    enum: [NoteTextContent, NoteImageContent, NoteFileContent].map(c => c.name)
  })
  type: string
}

export const NoteContentSchema = SchemaFactory.createForClass(NoteContent)

export type NoteContentType = { type: string } & NoteTextContent | NoteImageContent | NoteFileContent
