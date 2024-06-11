import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { User } from '../../user/shema/user'
import { Entity } from '../../shared/type'

@Schema({timestamps: true})
export class Authentication extends Entity {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: User

  @Prop()
  token: string

  @Prop()
  refreshToken: string
}

export const AuthenticationSchema = SchemaFactory.createForClass(Authentication)