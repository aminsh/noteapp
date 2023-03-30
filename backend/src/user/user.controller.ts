import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { UserService } from './service/user.service';
import { RegisterDTO } from './dto/register.dto';
import { Identity } from '../shared/type';
import { UpdateUserDTO } from './dto/update-user-d-t.o';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() dto: RegisterDTO): Promise<Identity> {
    return this.userService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDTO): Promise<void> {
    return this.userService.update(id, dto);
  }
}
