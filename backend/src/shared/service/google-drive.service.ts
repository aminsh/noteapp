import { Injectable, NotFoundException, Scope } from '@nestjs/common'
import { google } from 'googleapis'
import { NpRequestContext } from './np-request-context.service'
import { AuthenticationRepository } from '../../auth/repository/authentication.repository'
import { GoogleDriveFindRequest, GoogleDrivePageableResponse } from '../dto/google-drive.view'
import { GoogleAuthService } from '../../auth/service/google-auth.service'
import { assembleGoogleDriveFile } from '../dto/file-assembler'
import { GoogleDriveExportDto } from '../dto/google-drive-export.dto'
import { FileView } from '../dto/file-view'

@Injectable({scope: Scope.REQUEST})
export class GoogleDriveService {
  constructor(
    private requestContext: NpRequestContext,
    private authenticationRepository: AuthenticationRepository,
    private googleAuthService: GoogleAuthService,
  ) {
  }

  async getDrive() {
    const auth = await this.authenticationRepository.findOne({
      user: {
        _id: this.requestContext.authenticatedUser.id,
      }
    })

    if (!auth)
      throw new NotFoundException()
    const oAuth2Client = this.googleAuthService.client

    oAuth2Client.setCredentials({
      access_token: auth.token,
      refresh_token: auth.refreshToken,
    })

    return google.drive({
      version: 'v3',
      auth: oAuth2Client,
    })
  }

  async findFiles({search, nextPageToken}: GoogleDriveFindRequest): Promise<GoogleDrivePageableResponse> {
    const drive = await this.getDrive()

    let q = `mimeType != 'application/vnd.google-apps.folder'`
    if (search)
      q = `${q} and name contains '${search}'`

    const {data} = await drive.files.list({
      q,
      pageSize: 10,
      fields: 'nextPageToken, files(name, id, mimeType,webContentLink,thumbnailLink, fileExtension)',
      pageToken: nextPageToken,
    })

    return {
      data: data.files?.map(assembleGoogleDriveFile),
      nextPageToken: data.nextPageToken,
    }
  }

  async export({fileId, mimeType}: GoogleDriveExportDto): Promise<FileView> {
    const drive = await this.getDrive()
    const {data} = await drive.files.get({fileId, alt: 'media'}, {responseType: 'stream'})
    return null
  }
}