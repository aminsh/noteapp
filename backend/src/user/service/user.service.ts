import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserStatus } from '../shema/user';
import { RegisterDTO } from '../dto/register.dto';
import { Identity } from '../../shared/type';
import { EqualsCaseInsensitive, hash } from '../../shared/utils';
import { USER_MESSAGE } from '../user.constants';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { LoginDTO } from '../dto/login.dto';
import { JWT_TOKEN_GENERATOR_SERVICE, JWTAccessToken, JwtTokenGeneratorService } from 'dx-nest-core/auth';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(JWT_TOKEN_GENERATOR_SERVICE) private jwtTokenGeneratorService: JwtTokenGeneratorService
    ) {}

  async create(dto: RegisterDTO): Promise<Identity> {
    const isDuplicated = await this.userModel
      .findOne({
        email: EqualsCaseInsensitive(dto.email),
        status: { $ne: UserStatus.Pending }
      }, { _id: true })
      .exec();

    if (isDuplicated)
      throw new BadRequestException(USER_MESSAGE.THE_EMAIL_IS_DUPLICATED);

    const entity = new this.userModel();
    entity.name = dto.name;
    entity.email = dto.email.toLowerCase();
    entity.password = hash(dto.password);
    entity.status = UserStatus.Pending;

    await entity.save();
    return { id: entity._id.toString() };
  }

  async update(id: string, dto: UpdateUserDTO): Promise<void> {
    const entity = await this.userModel.findOne({ _id: id, status: UserStatus.Active }).exec();

    if (!entity)
      throw new NotFoundException();

    entity.name = dto.name;
    await entity.save();
  }

  async login({ email, password }: LoginDTO): Promise<JWTAccessToken> {
    const entity = await this.userModel.findOne({
      email: email.toLowerCase(),
      password: hash(password),
      status: UserStatus.Active
    })
      .exec();

    if (!entity)
      throw new UnauthorizedException();

    return this.jwtTokenGeneratorService.generate({ _id: entity._id, email: entity.email });
  }
}
