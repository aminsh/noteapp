import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { FilterQuery } from 'mongoose'
import { Note } from '../schema/note'
import { PageableRequest } from '../../shared/type'

@InputType()
export class NoteFileRequest extends PageableRequest {
  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  search: string

  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  id: string
}

export const handleNoteFileRequest = (request: NoteFileRequest, userId: string): { filter: FilterQuery<Note> } => {
  const filter: FilterQuery<Note> = {
    $or: [
      {
        owner: {
          _id: userId,
        },
        shared: {
          $elemMatch: {
            user: userId,
          },
        },
      },
    ],
  }

  if (request.search) {
    filter.$or = [
      {
        title: {
          $regex: request.search,
          $options: 'i',
        },
      },
      {
        title: {
          $regex: request.search,
          $options: 'i',
        },
      },
    ]
  }

  if (request.id) {
    filter._id = request.id
  }

  return {
    filter,
  }
}