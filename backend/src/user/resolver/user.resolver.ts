import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserView } from '../dto/user.view'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../shema/user'
import { RegisterDTO } from '../dto/register.dto'
import { IdentityResponse } from '../../shared/type'
import { UserService } from '../service/user.service'
import { UpdateUserDTO } from '../dto/update-user.dto'
import { VoidResolver } from 'graphql-scalars'
import { TokenResponse } from '../dto/token-response'
import { LoginDTO } from '../dto/login.dto'
import { userAssembler } from '../dto/user-assembler';
import { UseGuards } from '@nestjs/common';
import { JwtGqlAuthenticationGuard } from 'dx-nest-core/auth';
import { RequestContext } from '../../shared/service/request-context';

@Resolver(() => UserView)
export class UserResolver {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
    private requestContext: RequestContext
  ) {}

  @Mutation(() => IdentityResponse)
  async register(@Args('userRegister') dto: RegisterDTO): Promise<IdentityResponse> {
    const result = await this.userService.create(dto)
    return { id: result['_id'] }
  }

  @Mutation(() => TokenResponse)
  login(@Args('userLogin') dto: LoginDTO): Promise<TokenResponse> {
    return this.userService.login(dto)
  }

  @Mutation(() => VoidResolver, { nullable: true })
  update(
    @Args('userId') id: string,
    @Args('updateUser') dto: UpdateUserDTO): Promise<void> {
    return this.userService.update(id, dto)
  }

  @Query(() => [ UserView ], { name: 'UsersFindById' })
  async findManyById(
    @Args({ name: 'ids', type: () => [ String ] }) ids: string[]
  ): Promise<UserView[]> {
    const data = await this.userModel.find({
      _id: {
        $in: ids
      }
    })

    return data.map(userAssembler)
  }

  @UseGuards(JwtGqlAuthenticationGuard)
  @Query(() => [ UserView ], { name: 'UsersSearch' })
  async search(
    @Args('term') term: string,
    @Args({ name: 'take', type: () => Int }) take: number
  ): Promise<UserView[]> {
    const data = await this.userModel.find({
      $or: [
        {
          name: { $regex: term, $options: 'i' }
        },
        {
          email: { $regex: term, $options: 'i' }
        }
      ],
      _id: { $ne: this.requestContext.authenticatedUser.id }
    })
      .limit(take)

    return data.map(userAssembler)
  }
}
