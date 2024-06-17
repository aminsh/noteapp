import { File, FileSource } from '../schema/file'
import { FileType, FileView } from './file-view'
import { userAssembler } from '../../user/dto/user-assembler'
import { drive_v3 } from 'googleapis'

export const fileAssembler = (entity: File): FileView => {
  return {
    id: entity._id,
    createdBy: userAssembler(entity.createdBy),
    filename: entity.filename,
    originalName: entity.originalName,
    size: entity.size,
    mimeType: entity.mimeType,
    type: fileMimeMapper[entity.mimeType],
    url: null,
    source: null,
  }
}

const fileMimeMapper: Record<string, FileType> = {
  'image/jpeg': FileType.JPG,
  'image/png': FileType.PNG,
  'application/pdf': FileType.PDF,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileType.XLS,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileType.DOC,
}

export const assembleGoogleDriveFile = (file: drive_v3.Schema$File): FileView => {
  return {
    id: file.id,
    originalName: file.name,
    size: null,
    type: googleDriveFileTypeMapper[file.fileExtension],
    mimeType: file.mimeType,
    createdBy: null,
    filename: null,
    url: file.thumbnailLink,
    source: FileSource.GoogleDive,
  }
}

const googleDriveFileTypeMapper: Record<string, FileType> = {
  'jpeg': FileType.JPG,
  'jpg': FileType.JPG,
  'png': FileType.PNG,
  'pdf': FileType.PDF,
  'xlsx': FileType.XLS,
  'docx': FileType.DOC,
  'txt': FileType.TXT,
}
