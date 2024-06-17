import { Injectable, Scope } from '@nestjs/common'
import { FileRepository } from '../repository/file.repository'
import { NpRequestContext } from './np-request-context.service'
import { File } from '../schema/file'
import { UserRepository } from '../../user/repository/user.repository'
import { FileDto } from '../dto/file.dto'

@Injectable({ scope: Scope.REQUEST })
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository,
    private requestContext: NpRequestContext
  ) {}

  async create(file: FileDto): Promise<File> {
    const user = await this.userRepository.findOne({ _id: this.requestContext.authenticatedUser.id })

    const entity = new File()
    entity.createdBy = user
    entity.filename = file.fileName
    entity.originalName = file.originalName
    entity.mimeType = file.mimeType
    entity.size = file.size
    entity.source = file.source
    entity.reference = file.reference

    return this.fileRepository.create(entity)
  }
}
