import { Query, Resolver } from '@nestjs/graphql'
import { FileView } from '../dto/file-view'
import { InjectModel } from '@nestjs/mongoose'
import { File } from '../schema/file'
import { Model } from 'mongoose'
import { NpRequestContext } from '../service/np-request-context.service'
import { fileAssembler } from '../dto/file-assembler'
import { UseGuards } from '@nestjs/common'
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth'

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => FileView)
export class FileResolver {
  constructor(
    @InjectModel(File.name) private model: Model<File>,
    private requestContext: NpRequestContext
  ) {
  }

  @Query(() => [FileView], {name: 'FileFind'})
  async find(): Promise<FileView[]> {
    const data = await this.model.find({
      createdBy: {
        _id: this.requestContext.authenticatedUser.id
      }
    })
      .populate('createdBy')
    return data.map(fileAssembler)
  }
}