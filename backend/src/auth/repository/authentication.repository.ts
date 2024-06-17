import { FilterQuery, Model, ProjectionType } from 'mongoose'
import { Repository } from '../../shared/type'
import { Authentication } from '../schema/authentication'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AuthenticationRepository implements Repository<Authentication> {
  constructor(@InjectModel(Authentication.name) private model: Model<Authentication>) {}

  findOne(filter: FilterQuery<Authentication>, projection?: ProjectionType<Authentication>): Promise<Authentication> {
    return this.model.findOne(filter, projection)
  }

  find(filter: FilterQuery<Authentication>, projection?: ProjectionType<Authentication>): Promise<Authentication[]> {
    return this.model.find(filter, projection)
  }

  create(entity: Authentication): Promise<Authentication> {
    const data = new this.model(entity)
    return data.save()
  }

  async update(entity: Authentication): Promise<void> {
    await this.model.updateOne({
      _id: entity._id
    }, entity)
  }

  async remove(entity: Authentication): Promise<void> {
    await this.model.deleteOne({ _id: entity._id })
  }
}