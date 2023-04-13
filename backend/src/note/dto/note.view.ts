import { Field, ObjectType } from '@nestjs/graphql';
import { UserView } from '../../user/dto/user.view';

@ObjectType()
export class NoteView {
  @Field(() => UserView, { nullable: true })
  owner: UserView;

  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;
}
