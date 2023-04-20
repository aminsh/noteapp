import { IsEmail, IsString } from "class-validator"
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RegisterDTO {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string
}
