import { JWTAccessToken } from 'dx-nest-core/auth'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TokenResponse implements JWTAccessToken {
  @Field()
  access_token: string

  @Field()
  expires_in: string

  @Field()
  token_type: string
}
