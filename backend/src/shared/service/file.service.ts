import { Injectable, Scope } from '@nestjs/common'
import { FileRepository } from '../repository/file.repository'
import { RequestContext } from './request-context'
import { File } from '../schema/file'
import { UserRepository } from '../../user/repository/user.repository'

@Injectable({ scope: Scope.REQUEST })
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository,
    private requestContext: RequestContext
  ) {}

  async create(file: Express.Multer.File): Promise<File> {
    const user = await this.userRepository.findOne({ _id: this.requestContext.authenticatedUser.id })

    const entity = new File()
    entity.createdBy = user
    entity.filename = file.filename
    entity.originalName = file.originalname
    entity.mimeType = file.mimetype
    entity.size = file.size

    return this.fileRepository.create(entity)
  }
}
