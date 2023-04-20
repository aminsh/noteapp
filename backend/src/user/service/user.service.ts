import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { User, UserStatus } from '../shema/user'
import { RegisterDTO } from '../dto/register.dto'
import { EqualsCaseInsensitive, hash } from '../../shared/utils'
import { USER_MESSAGE } from '../user.constants'
import { JWT_TOKEN_GENERATOR_SERVICE, JWTAccessToken, JwtTokenGeneratorService } from 'dx-nest-core/auth'
import { UserRepository } from '../repository/user.repository'
import { UpdateUserDTO } from '../dto/update-user.dto'
import { LoginDTO } from '../dto/login.dto'

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(JWT_TOKEN_GENERATOR_SERVICE) private jwtTokenGeneratorService: JwtTokenGeneratorService
  ) {}

  async create(dto: RegisterDTO): Promise<User> {
    const isDuplicated = await this.userRepository.findOne({
      email: EqualsCaseInsensitive(dto.email),
      status: { $ne: UserStatus.Pending }
    }, { _id: true })

    if (isDuplicated)
      throw new BadRequestException(USER_MESSAGE.THE_EMAIL_IS_DUPLICATED)

    const entity = new User()
    entity.name = dto.name
    entity.email = dto.email.toLowerCase()
    entity.password = hash(dto.password)
    entity.status = UserStatus.Pending

    return this.userRepository.create(entity)
  }

  async update(id: string, dto: UpdateUserDTO): Promise<void> {
    const entity = await this.userRepository.findOne({ _id: id, status: UserStatus.Active })

    if (!entity)
      throw new NotFoundException()

    entity.name = dto.name
    await this.userRepository.update(entity)
  }

  async login({ email, password }: LoginDTO): Promise<JWTAccessToken> {
    const entity = await this.userRepository.findOne({
      email: email.toLowerCase(),
      password: hash(password),
      status: UserStatus.Active
    })

    if (!entity)
      throw new UnauthorizedException()

    return this.jwtTokenGeneratorService.generate({ _id: entity['_id'], email: entity.email })
  }
}
