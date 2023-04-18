import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Entity } from '../../shared/type';
import { User } from '../../user/shema/user';
import { File } from '../../shared/schema/file';

@Schema({ timestamps: true })
export class Note extends Entity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: User;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop([ { type: mongoose.Schema.Types.ObjectId, ref: File.name } ])
  attachments: File[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);
