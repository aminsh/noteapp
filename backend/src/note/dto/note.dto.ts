import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString } from 'class-validator'

@InputType()
export class NoteDto {
  @Field()
  @IsString()
  title: string

  @Field()
  @IsString()
  content: string

  @Field(() => [ String ], { nullable: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  attachments?: string[]

  @Field(() => [ String ], { nullable: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  shared?: string[]
}
