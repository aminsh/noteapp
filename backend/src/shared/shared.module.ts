import * as path from 'path'
import { Global, Module } from '@nestjs/common'
import { NpRequestContext } from './service/np-request-context.service'
import { MulterModule } from '@nestjs/platform-express'
import { FILES_ROOT_NAME, MESSAGE_SERVICE } from './shared.contacts'
import { FileService } from './service/file.service'
import { FileRepository } from './repository/file.repository'
import { FileController } from './controller/file.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { File, FileSchema } from './schema/file'

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: path.join(process.cwd(), FILES_ROOT_NAME)
    }),
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema }
    ]),
  ],
  providers: [
    NpRequestContext,
    FileService,
    FileRepository
  ],
  controllers: [
    FileController
  ],
  exports: [
    NpRequestContext,
    FileRepository,
  ]
})
export class SharedModule {
}
