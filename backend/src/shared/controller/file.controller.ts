import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { FileService } from '../service/file.service'
import { JwtHttpAuthenticationGuard } from 'dx-nest-core/auth'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { fileAssembler } from '../dto/file-assembler'
import { FileView } from '../dto/file-view'

@UseGuards(JwtHttpAuthenticationGuard)
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'file',
            format: 'binary'
          }
        }
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([ { name: 'files' } ]))
  @Post('upload')
  async upload(@UploadedFiles() files: { files: Express.Multer.File[] }): Promise<FileView[]> {
    const result = await this.fileService.createMany(files.files)
    return result.map(fileAssembler)
  }
}
