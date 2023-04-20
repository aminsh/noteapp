import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { File } from '../schema/file'
import { FilterQuery, Model, ProjectionType } from 'mongoose'

@Injectable()
export class FileRepository {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  createMany(entities: File[]): Promise<File[]> {
    return this.fileModel.insertMany(entities.map(entity => new this.fileModel(entity)))
  }

  find(filter: FilterQuery<File>, projection?: ProjectionType<File>): Promise<File[]> {
    return this.fileModel.find(filter, projection)
  }
}
