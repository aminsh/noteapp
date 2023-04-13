import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NoteView {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;
}
