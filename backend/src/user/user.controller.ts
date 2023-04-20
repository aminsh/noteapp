import { Body, Controller, Param, Post, Put } from "@nestjs/common"
import { UserService } from './service/user.service'
import { RegisterDTO } from './dto/register.dto'
import { Identity } from '../shared/type'
import { UpdateUserDTO } from './dto/update-user.dto'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() dto: RegisterDTO): Promise<Identity> {
    const result = await this.userService.create(dto)
    return { id: result['_id'] }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDTO): Promise<void> {
    return this.userService.update(id, dto)
  }
}
