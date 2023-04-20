import { UserView } from '../../user/dto/user.view'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FileView {
  @Field()
  id: string

  @Field(() => UserView, { nullable: true })
  createdBy: UserView

  @Field()
  filename: string

  @Field()
  originalName: string

  @Field()
  mimeType: string

  @Field()
  size: number
}
