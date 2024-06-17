import { UserView } from '../../user/dto/user.view'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { PageableResponse } from '../type'
import { FileSource } from '../schema/file'

export enum FileType {
  JPG = 'JPG',
  PNG = 'PNG',
  XLS = 'XLS',
  PDF = 'PDF',
  DOC = 'DOC',
  TXT = 'TXT',
}

registerEnumType(FileType, {name: 'FileType'})
registerEnumType(FileSource, {name: 'FileSource'})

@ObjectType()
export class FileView {
  @Field()
  id: string

  @Field(() => UserView, {nullable: true})
  createdBy: UserView

  @Field()
  filename: string

  @Field()
  originalName: string

  @Field(() => FileType, {nullable: true})
  type: FileType

  @Field()
  mimeType: string

  @Field()
  size: number

  @Field(() => String, {nullable: true})
  url: string

  @Field(() => FileSource, {nullable: true})
  source: FileSource
}

@ObjectType()
export class FilePageableResponse extends PageableResponse<FileView> {
  @Field(() => [FileView])
  data: FileView[]
}



