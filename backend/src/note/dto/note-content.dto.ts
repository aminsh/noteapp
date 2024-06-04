import * as Enumerable from 'linq'
import { createUnionType, Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { NoteTextContent } from '../schema/note-text-content'
import { NoteImageContent } from '../schema/note-image-content'

import { NoteFileContent } from '../schema/note-file-content'
import { GraphQLUnionType } from 'graphql/type'

export const ContentType = Enumerable.from([
  NoteTextContent,
  NoteImageContent,
  NoteFileContent,
]).toObject(it => it.name, it => it.name)

registerEnumType(ContentType, {name: 'ContentType'})

@InputType()
export class NoteContentDto {
  @Field()
  @IsString()
  type: string
}

@InputType()
export class NoteTextContentDto extends NoteContentDto {
  @Field()
  @IsString()
  text: string
}

@InputType()
export class NoteImageContentDto extends NoteContentDto {
  @Field(() => [String])
  @IsString({each: true})
  images: string[]
}

@InputType()
export class NoteFileContentDto extends NoteContentDto {
  @Field(() => [String])
  @IsString({each: true})
  images: string[]
}

export const NoteContentDtoType = createInput({
  name: 'NoteContentDto',
  types: () => [NoteTextContentDto, NoteImageContentDto, NoteFileContentDto] as const,
})

export type NoteContentTypeDto = NoteTextContentDto | NoteImageContentDto | NoteFileContentDto

