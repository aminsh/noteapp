import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  status: UserStatus;
}

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active'
}

export const UserSchema = SchemaFactory.createForClass(User);
