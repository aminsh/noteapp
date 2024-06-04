import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString } from 'class-validator'
import { NoteContentDtoType, NoteContentTypeDto } from './note-content.dto'

@InputType()
export class NoteDto {
  @Field()
  @IsString()
  title: string

  @Field(() => [NoteContentDtoType])
  @IsString({each: true})
  contents: NoteContentTypeDto[]

  @Field(() => [String], {nullable: true})
  @IsString({each: true})
  @IsArray()
  @IsOptional()
  attachments?: string[]

  @Field(() => [String], {nullable: true})
  @IsString({each: true})
  @IsArray()
  @IsOptional()
  shared?: string[]
}
