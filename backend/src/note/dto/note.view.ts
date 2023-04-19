import { Field, ObjectType } from '@nestjs/graphql';
import { UserView } from '../../user/dto/user.view';
import { FileView } from '../../shared/dto/file-view';
import { NoteSharedView } from './note-shared.view';

@ObjectType()
export class NoteView {
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

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

  @Field(() => [ NoteSharedView ], { nullable: true })
  shared: NoteSharedView[];
}
