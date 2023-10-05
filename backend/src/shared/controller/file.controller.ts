import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiConsumes } from '@nestjs/swagger'
import { FileService } from '../service/file.service'
import { JwtHttpAuthenticationGuard } from 'dx-nest-core/auth'
import { FileInterceptor } from '@nestjs/platform-express'
import { fileAssembler } from '../dto/file-assembler'
import { FileView } from '../dto/file-view'

@UseGuards(JwtHttpAuthenticationGuard)
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@UploadedFile() file: Express.Multer.File): Promise<FileView> {
    const entity = await this.fileService.create(file)
    return fileAssembler(entity)
  }
}
