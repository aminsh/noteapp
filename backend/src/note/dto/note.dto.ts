import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class NoteDto {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  content: string;
}
