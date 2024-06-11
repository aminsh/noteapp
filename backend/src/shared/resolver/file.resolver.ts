import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FilePageableResponse, FileView } from '../dto/file-view'
import { InjectModel } from '@nestjs/mongoose'
import { File } from '../schema/file'
import { FilterQuery, Model } from 'mongoose'
import { NpRequestContext } from '../service/np-request-context.service'
import { fileAssembler } from '../dto/file-assembler'
import { UseGuards } from '@nestjs/common'
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth'
import { FileFindRequest, handleFileFindRequest } from '../dto/file-find-request'
import { GoogleDriveService } from '../service/google-drive.service'
import { GoogleDriveFindRequest, GoogleDrivePageableResponse } from '../dto/google-drive.view'
import { GoogleDriveExportDto } from '../dto/google-drive-export.dto'

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => FileView)
export class FileResolver {
  constructor(
    @InjectModel(File.name) private model: Model<File>,
    private requestContext: NpRequestContext,
    private googleDriveService: GoogleDriveService,
  ) {
  }

  @Query(() => FilePageableResponse, {name: 'filesFind'})
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
      this.model.find(
        filter,
        {},
        {
          sort: {createdAt: -1},
        })
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

  @Query(() => GoogleDrivePageableResponse, {name: 'googleDriveFind'})
  googleDriveFind(
    @Args('request', {type: () => GoogleDriveFindRequest}) request: GoogleDriveFindRequest,
  ): Promise<GoogleDrivePageableResponse> {
    return this.googleDriveService.findFiles(request)
  }

  @Mutation(() => FileView, {name: 'googleDriveExport'})
  googleDriveExport(
    @Args('input', {type: () => GoogleDriveExportDto}) input: GoogleDriveExportDto
  ): Promise<FileView> {
    return this.googleDriveService.export(input)
  }
}