import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserView } from '../dto/user.view';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../shema/user';
import { RegisterDTO } from '../dto/register.dto';
import { IdentityResponse } from '../../shared/type';
import { UserService } from '../service/user.service';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { VoidResolver } from 'graphql-scalars';

@Resolver(() => UserView)
export class UserResolver {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService
  ) {}

  @Query(() => [ UserView ])
  async getUsers(): Promise<UserView[]> {
    const users = await this.userModel.find().exec();
    return users.map<UserView>(e => ({
      id: e.id.toString(),
      name: e.name,
      email: e.email
    }));
  }

  @Mutation(() => IdentityResponse)
  register(@Args('userRegister') dto: RegisterDTO): Promise<IdentityResponse> {
    return this.userService.create(dto);
  }

  @Mutation(() => VoidResolver, { nullable: true })
  update(
    @Args('userId') id: string,
    @Args('updateUser') dto: UpdateUserDTO): Promise<void> {
    return this.userService.update(id, dto);
  }
}
