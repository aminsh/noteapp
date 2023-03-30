import { Field, ObjectType } from '@nestjs/graphql';

export interface Identity {
  id: string;
}

@ObjectType()
export class IdentityResponse {
  @Field()
  id: string;
}
