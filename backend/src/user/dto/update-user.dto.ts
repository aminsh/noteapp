import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserDTO {
  @Field()
  @IsString()
  name: string
}
