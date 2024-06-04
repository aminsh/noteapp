import { Args, Query, Resolver } from '@nestjs/graphql'
import { FilePageableResponse, FileView } from '../dto/file-view'
import { InjectModel } from '@nestjs/mongoose'
import { File } from '../schema/file'
import { FilterQuery, Model } from 'mongoose'
import { NpRequestContext } from '../service/np-request-context.service'
import { fileAssembler } from '../dto/file-assembler'
import { UseGuards } from '@nestjs/common'
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth'
import { FileFindRequest, handleFileFindRequest } from '../dto/file-find-request'

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => FileView)
export class FileResolver {
  constructor(
    @InjectModel(File.name) private model: Model<File>,
    private requestContext: NpRequestContext,
  ) {
  }

  @Query(() => FilePageableResponse, {name: 'fileFind'})
  async find(
    @Args('request', {type: () => FileFindRequest}) request: FileFindRequest,
  ): Promise<FilePageableResponse> {
    const filter: FilterQuery<File> = {
      createdBy: {
        _id: this.requestContext.authenticatedUser.id,
      },
      ...handleFileFindRequest(request).filter,
    }

    const [data, count] = await Promise.all([
      this.model.find(filter)
        .populate('createdBy')
        .limit(request.take)
        .skip(request.skip),
      this.model.count(filter),
    ])

    return {
      count,
      data: data.map(fileAssembler),
    }
  }
}