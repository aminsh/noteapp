import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { FileView } from './file-view'
import { IsOptional, IsString } from 'class-validator'

@ObjectType()
export class GoogleDrivePageableResponse {
  @Field(() => [FileView])
  data: FileView[]

  @Field(() => String, {nullable: true})
  nextPageToken: string
}

@InputType()
export class GoogleDriveFindRequest {
  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  search: string

  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  nextPageToken: string
}