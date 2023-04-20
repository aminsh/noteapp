import { File } from '../schema/file'
import { FileView } from './file-view'
import { userAssembler } from '../../user/dto/user-assembler'

export const fileAssembler = (entity: File): FileView => {
  return {
    id: entity._id,
    createdBy: userAssembler(entity.createdBy),
    filename: entity.filename,
    originalName: entity.originalName,
    size: entity.size,
    mimeType: entity.mimeType
  }
}
