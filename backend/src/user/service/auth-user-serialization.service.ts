import { AuthUserSerializationService } from 'dx-nest-core/auth'
import { User } from '../shema/user'

export class AuthUserSerializationServiceImp implements AuthUserSerializationService<User> {
  transform(user: User): any {
    return {
      _id: user['_id'],
      email: user.email
    }
  }
}
