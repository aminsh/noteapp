import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../shema/user'
import { FilterQuery, Model, ProjectionType } from 'mongoose'

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findOne(filter: FilterQuery<User>, projection?: ProjectionType<User>): Promise<User> {
    return this.userModel.findOne(filter, projection)
  }

  find(filter: FilterQuery<User>, projection?: ProjectionType<User>): Promise<User[]> {
    return this.userModel.find(filter, projection)
  }

  create(entity: User): Promise<User> {
    const data = new this.userModel(entity)
    return data.save()
  }

  async update(entity: User): Promise<void> {
    await this.userModel.updateOne(entity)
  }
}
