import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Entity } from '../../shared/type';

@Schema()
export class Note extends Entity {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
