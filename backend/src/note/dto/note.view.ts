import { Field, ObjectType } from '@nestjs/graphql';
import { UserView } from '../../user/dto/user.view';
import { FileView } from '../../shared/dto/file-view';

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

  @Field(() => [ FileView ], { nullable: true })
  attachments: FileView[];
}
