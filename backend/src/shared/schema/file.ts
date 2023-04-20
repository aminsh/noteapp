import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Entity } from '../type'
import { User } from '../../user/shema/user'
import mongoose from 'mongoose'

@Schema()
export class File extends Entity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User

  @Prop()
  filename: string

  @Prop()
  originalName: string

  @Prop()
  mimeType: string

  @Prop()
  size: number
}

export const FileSchema = SchemaFactory.createForClass(File)
