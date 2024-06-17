import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Entity } from '../type'
import { User } from '../../user/shema/user'
import mongoose from 'mongoose'

export enum FileSource {
  GoogleDive = 'GoogleDive',
}

@Schema({timestamps: true})
export class File extends Entity {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  createdBy: User

  @Prop()
  filename: string

  @Prop()
  originalName: string

  @Prop()
  mimeType: string

  @Prop()
  size: number

  @Prop({type: String, enum: Object.values(FileSource)})
  source: FileSource

  @Prop()
  reference: string
}

export const FileSchema = SchemaFactory.createForClass(File)
