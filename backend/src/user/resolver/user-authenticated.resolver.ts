import { Query, Resolver } from '@nestjs/graphql';
import { UserView } from '../dto/user.view';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth';
import { RequestContext } from '../../shared/service/request-context';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../shema/user';
import { userAssembler } from '../dto/user-assembler';

@UseGuards(JwtGqlAuthenticationGuard)
@Resolver(() => UserView)
export class UserAuthenticatedResolver {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private requestContext: RequestContext
  ) {}

  @Query(() => [ UserView ])
  async getUsers(): Promise<UserView[]> {
    const users = await this.userModel.find()
    return users.map<UserView>(e => ({
      id: e.id.toString(),
      name: e.name,
      email: e.email
    }))
  }

  @Query(() => UserView, { name: 'UserCurrent' })
  async getCurrent(): Promise<UserView> {
    const currentUser = await this.userModel.findOne({ _id: this.requestContext.authenticatedUser.id })
    return userAssembler(currentUser);
  }
}
