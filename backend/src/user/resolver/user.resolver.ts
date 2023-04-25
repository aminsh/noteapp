import { Args, Mutation, Resolver } from '@nestjs/graphql'
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

@Resolver(() => UserView)
export class UserResolver {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService
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
}
