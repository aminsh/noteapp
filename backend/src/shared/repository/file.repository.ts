import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { File } from '../schema/file'
import { FilterQuery, Model, ProjectionType } from 'mongoose'

@Injectable()
export class FileRepository {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  create(entity: File): Promise<File> {
    const data = new this.fileModel(entity)
    return data.save()
  }

  find(filter: FilterQuery<File>, projection?: ProjectionType<File>): Promise<File[]> {
    return this.fileModel.find(filter, projection)
  }
}
