import { Field, InputType } from '@nestjs/graphql'
import { PageableRequest } from '../type'
import { IsOptional, IsString } from 'class-validator'
import { FilterQuery } from 'mongoose'
import { File } from '../schema/file'

@InputType()
export class FileFindRequest extends PageableRequest {
  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  search: string
}

export const handleFileFindRequest = (request: FileFindRequest): { filter: FilterQuery<File> } => {
  const filter: FilterQuery<File> = {}

  if (request.search)
    filter.originalName = {
      $regex: request.search,
      $options: 'i',
    }

  return {
    filter,
  }
}