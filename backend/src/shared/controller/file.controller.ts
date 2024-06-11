import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiConsumes } from '@nestjs/swagger'
import { FileService } from '../service/file.service'
import { JwtHttpAuthenticationGuard } from 'dx-nest-core/auth'
import { FileInterceptor } from '@nestjs/platform-express'
import { fileAssembler } from '../dto/file-assembler'
import { FileView } from '../dto/file-view'
import { GoogleDriveService } from '../service/google-drive.service'
import { GoogleDriveFindRequest } from '../dto/google-drive.view'

@UseGuards(JwtHttpAuthenticationGuard)
@Controller('files')
export class FileController {
  constructor(
    private fileService: FileService,
    private googleDriveService: GoogleDriveService
  ) {
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@UploadedFile() file: Express.Multer.File): Promise<FileView> {
    const entity = await this.fileService.create(file)
    return fileAssembler(entity)
  }

  @Get('google-drive')
  getGoogleDrive() {
    return this.googleDriveService.findFiles({search: '', nextPageToken: null} as GoogleDriveFindRequest)
  }
}
