import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserView {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  email: string
}
