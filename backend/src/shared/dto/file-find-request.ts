import { Field, InputType } from '@nestjs/graphql'
import { PageableRequest } from '../type'
import { IsOptional, IsString } from 'class-validator'
import { FilterQuery, Types } from 'mongoose'
import { File } from '../schema/file'

@InputType()
export class FileFindRequest extends PageableRequest {
  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  search: string

  @Field(() => [String], {nullable: true})
  @IsString({each: true})
  @IsOptional()
  ids: string[]

  @Field(() => [String], {nullable: true})
  @IsString({each: true})
  @IsOptional()
  notEqualIds: string[]
}

export const handleFileFindRequest = (request: FileFindRequest): { filter: FilterQuery<File> } => {
  const filter: FilterQuery<File> = {}

  if (request.search)
    filter.originalName = {
      $regex: request.search,
      $options: 'i',
    }

  if (request.ids?.length)
    filter._id = {
      $in: request.ids,
    }

  if (request.notEqualIds?.length)
    filter._id = {
      $nin: request.notEqualIds,
    }

  return {
    filter,
  }
}