import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './shema/user'
import { UserService } from './service/user.service'
import { UserController } from './user.controller'
import { UserResolver } from './resolver/user.resolver'
import { AuthModule } from 'dx-nest-core/auth'
import { AuthUserSerializationServiceImp } from './service/auth-user-serialization.service'
import { UserRepository } from './repository/user.repository'
import { UserAuthenticatedResolver } from './resolver/user-authenticated.resolver';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    AuthModule.register({
      jwt: {
        secret: 'P@ssw0rd',
        expiresIn: '72h'
      },
      userSerializationService: AuthUserSerializationServiceImp
    }),
  ],
  providers: [
    UserRepository,
    UserService,
    UserResolver,
    UserAuthenticatedResolver
  ],
  controllers: [
    UserController
  ],
  exports: [
    UserRepository
  ]
})
export class UserModule {
}
