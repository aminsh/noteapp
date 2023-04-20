import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Entity } from '../../shared/type'

@Schema({ timestamps: true })
export class User extends Entity {
  @Prop()
  name: string

  @Prop()
  email: string

  @Prop()
  password: string

  @Prop()
  status: UserStatus
}

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active'
}

export const UserSchema = SchemaFactory.createForClass(User)
