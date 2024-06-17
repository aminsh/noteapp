import { Global, Module } from '@nestjs/common'
import { GoogleController } from './controller/google.controller'
import { GoogleStrategy } from './strategy/google.strategy'
import { MongooseModule } from '@nestjs/mongoose'
import { Authentication, AuthenticationSchema } from './schema/authentication'
import { AuthenticationRepository } from './repository/authentication.repository'
import { GoogleAuthService } from './service/google-auth.service'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Authentication.name, schema: AuthenticationSchema},
    ])
  ],
  providers: [
    GoogleStrategy,
    AuthenticationRepository,
    GoogleAuthService,
  ],
  controllers: [
    GoogleController,
  ],
  exports: [
    AuthenticationRepository,
    GoogleAuthService,
  ]
})
export class AuthModule {}