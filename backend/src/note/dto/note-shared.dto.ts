import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { NoteAccess } from '../schema/note-shared'

@InputType()
export class NoteShareDTO {
  @Field()
  @IsString()
  userId: string

  @Field(() => NoteAccess)
  @IsString()
  access: NoteAccess
}

registerEnumType(NoteAccess, { name: 'NoteAccess' })
