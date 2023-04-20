import { UserView } from '../../user/dto/user.view'
import { NoteAccess } from '../schema/note-shared'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NoteSharedView {
  @Field(() => UserView, { nullable: true })
  user: UserView

  @Field(() => NoteAccess)
  access: NoteAccess
}
