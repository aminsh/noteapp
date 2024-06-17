import { Injectable, NotFoundException, Scope } from '@nestjs/common'
import { google } from 'googleapis'
import { NpRequestContext } from './np-request-context.service'
import { AuthenticationRepository } from '../../auth/repository/authentication.repository'
import { GoogleDriveFindRequest, GoogleDrivePageableResponse } from '../dto/google-drive.view'
import { GoogleAuthService } from '../../auth/service/google-auth.service'
import { assembleGoogleDriveFile, fileAssembler } from '../dto/file-assembler'
import { FileView } from '../dto/file-view'
import { writeReadableStream } from '../utils/file.utils'
import { FileService } from './file.service'
import { FileSource } from '../schema/file'

@Injectable({scope: Scope.REQUEST})
export class GoogleDriveService {
  constructor(
    private requestContext: NpRequestContext,
    private authenticationRepository: AuthenticationRepository,
    private googleAuthService: GoogleAuthService,
    private fileService: FileService,
  ) {
  }

  async getDrive() {
    const auth = await this.authenticationRepository.findOne({
      user: {
        _id: this.requestContext.authenticatedUser.id,
      },
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

  async clone(id: string): Promise<FileView> {
    const drive = await this.getDrive()
    const {data: dataStream} = await drive.files.get({fileId: id, alt: 'media'}, {responseType: 'stream'})

    await writeReadableStream({
      data: dataStream,
      fileName: id,
    })

    const {data} = await drive.files.get({fileId: id, fields: 'name,id,mimeType,size'})

    const createdFile = await this.fileService.create({
      fileName: data.id,
      originalName: data.name,
      mimeType: data.mimeType,
      size: Number(data.size),
      source: FileSource.GoogleDive,
      reference: id,
    })

    return fileAssembler(createdFile)
  }
}