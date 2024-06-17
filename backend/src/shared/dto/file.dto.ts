import { FileSource } from '../schema/file'

export class FileDto {
  fileName: string
  originalName: string
  mimeType: string
  size: number
  source?: FileSource
  reference?: string
}