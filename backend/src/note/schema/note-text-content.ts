import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class NoteTextContent {
  @Prop()
  text: string
}

export const NoteTextContentSchema = SchemaFactory.createForClass(NoteTextContent)