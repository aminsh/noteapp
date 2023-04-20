import { Field, ObjectType } from '@nestjs/graphql'
import { FilterQuery, ProjectionType } from 'mongoose'

export interface Identity {
  id: string;
}

@ObjectType()
export class IdentityResponse {
  @Field()
  id: string
}

export class Entity {
  _id: string

  createdAt: Date

  updatedAt: Date
}

export interface Repository<TEntity> {
  findOne(filter: FilterQuery<TEntity>, projection?: ProjectionType<TEntity>): Promise<TEntity>;

  find(filter: FilterQuery<TEntity>, projection?: ProjectionType<TEntity>): Promise<TEntity[]>;

  create(entity: TEntity): Promise<TEntity>;

  update(entity: TEntity): Promise<void>;

  remove(entity: TEntity): Promise<void>;
}
