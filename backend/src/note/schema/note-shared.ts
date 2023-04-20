import mongoose from 'mongoose'
import { User } from '../../user/shema/user'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export enum NoteAccess {
  ViewOnly = 'ViewOnly',
  AllowEdit = 'AllowEdit'
}

@Schema({ _id: false })
export class NoteShared {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User

  @Prop({ type: String, enum: Object.values(NoteAccess) })
  access: NoteAccess
}

export const NoteSharedSchema = SchemaFactory.createForClass(NoteShared)

