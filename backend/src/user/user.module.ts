import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shema/user';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserResolver } from './resolver/user.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [
    UserService,
    UserResolver
  ],
  controllers: [
    UserController
  ]
})
export class UserModule {
}
