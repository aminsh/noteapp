import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from '../shema/user';
import { RegisterDTO } from '../dto/register.dto';
import { Indentity } from '../../shared/type';
import { EqualsCaseInsensitive, hash } from '../../shared/utils';
import { USER_MESSAGE } from '../user.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: RegisterDTO): Promise<Indentity> {
    const isDuplicated = await this.userModel
      .findOne({ email: EqualsCaseInsensitive(dto.email) })
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
}
