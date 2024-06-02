import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

@InputType()
export class PageableRequest {
  @Field(() => Int)
  @IsNumber()
  take: number

  @Field(() => Int)
  @IsNumber()
  skip: number
}

@ObjectType()
export abstract class PageableResponse<TData> {
  @Field(() => Int, {nullable: true})
  count: number

  abstract data: TData[]
}