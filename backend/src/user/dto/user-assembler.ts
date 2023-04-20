import { User } from '../shema/user'
import { UserView } from './user.view'

export const userAssembler = (entity: User): UserView => {
  if (!entity)
    return null

  return {
    id: entity._id,
    email: entity.email,
    name: entity.name
  }
}
