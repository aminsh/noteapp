import { File } from '../schema/file'
import { FileType, FileView } from './file-view'
import { userAssembler } from '../../user/dto/user-assembler'

export const fileAssembler = (entity: File): FileView => {
  return {
    id: entity._id,
    createdBy: userAssembler(entity.createdBy),
    filename: entity.filename,
    originalName: entity.originalName,
    size: entity.size,
    mimeType: entity.mimeType,
    type: fileMimeMapper[entity.mimeType],
  }
}

const fileMimeMapper: Record<string, FileType> = {
  'image/jpeg': FileType.JPG,
  'image/png': FileType.PNG,
  'application/pdf': FileType.PDF,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileType.XLS,
}

