import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GoogleDriveFindRequest, GoogleDrivePageableResponse } from '../dto/google-drive.view'
import { FileView } from '../dto/file-view'
import { GoogleDriveService } from '../service/google-drive.service'

@Resolver(() => FileView)
export class GoogleDriveResolver {
  constructor(
    private googleDriveService: GoogleDriveService,
  ) {
  }

  @Query(() => GoogleDrivePageableResponse, {name: 'googleDriveFind'})
  find(
    @Args('request', {type: () => GoogleDriveFindRequest}) request: GoogleDriveFindRequest,
  ): Promise<GoogleDrivePageableResponse> {
    return this.googleDriveService.findFiles(request)
  }

  @Mutation(() => FileView, {name: 'googleDriveClone'})
  clone(
    @Args('id', {type: () => String}) id: string,
  ): Promise<FileView> {
    return this.googleDriveService.clone(id)
  }
}