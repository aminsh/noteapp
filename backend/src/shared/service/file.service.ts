import { Injectable, Scope } from '@nestjs/common'
import { FileRepository } from '../repository/file.repository'
import { RequestContext } from './request-context'
import { File } from '../schema/file'
import { UserRepository } from '../../user/repository/user.repository'

@Injectable({ scope: Scope.REQUEST })
export class FileService {
  constructor(private fileRepository: FileRepository,
              private userRepository: UserRepository,
              private requestContext: RequestContext) {}

  async createMany(dto: Express.Multer.File[]): Promise<File[]> {
    const user = await this.userRepository.findOne({ _id: this.requestContext.authenticatedUser.id })
    const entities = dto.map(e => {
      const instance = new File()
      instance.createdBy  = user
      instance.filename = e.filename
      instance.originalName = e.originalname
      instance.mimeType = e.mimetype
      instance.size = e.size
      return instance
    })

    return this.fileRepository.createMany(entities)
  }
}
