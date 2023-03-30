import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../shema/user';
import { RegisterDTO } from '../dto/register.dto';
import { Identity } from '../../shared/type';
import { EqualsCaseInsensitive, hash } from '../../shared/utils';
import { USER_MESSAGE } from '../user.constants';
import { UpdateUserDTO } from '../dto/update-user-d-t.o';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: RegisterDTO): Promise<Identity> {
    const isDuplicated = await this.userModel
      .findOne({ email: EqualsCaseInsensitive(dto.email) }, { _id: true })
      .exec();

    if (isDuplicated)
      throw new BadRequestException(USER_MESSAGE.THE_EMAIL_IS_DUPLICATED);

    const entity = new this.userModel();
    entity.name = dto.name;
    entity.email = dto.email.toLowerCase();
    entity.password = hash(dto.password);

    await entity.save();
    return { id: entity._id.toString() };
  }

  async update(id: string, dto: UpdateUserDTO): Promise<void> {
    const entity = await this.userModel.findOne({ _id: id }).exec();

    if (!entity)
      throw new NotFoundException();

    entity.name = dto.name;
    await entity.save();
  }
}
