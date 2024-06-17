import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GoogleDriveExportDto {
  @Field(() => String)
  @IsString()
  fileId: string

  @Field(() => String)
  @IsString()
  mimeType: string
}