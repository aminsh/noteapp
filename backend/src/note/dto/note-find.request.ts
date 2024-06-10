import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { FilterQuery, ObjectId } from 'mongoose'
import { Note } from '../schema/note'
import { PageableRequest } from '../../shared/type'

@InputType()
export class NoteFindRequest extends PageableRequest {
  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  search: string

  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  id: string
}

export const handleNoteFindRequest = (request: NoteFindRequest, userId: string): { filter: FilterQuery<Note> } => {
  const filter: FilterQuery<Note> = {
    $and: [
      {
        $or: [
          {
            owner: userId,
          },
          {
            shared: {
              $elemMatch: {
                user: userId,
              },
            },
          }
        ],
      },
    ],
  }

  if (request.search) {
    filter.$and.push({
      $or: [
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
      ],
    })
  }

  if (request.id)
    filter.$and.push({
      _id: request.id,
    })

  return {
    filter,
  }
}