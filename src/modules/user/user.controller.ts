import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto } from '../auth/dto/auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Post()
  async createUser(@Body() dto: AuthDto) {
    return await this.userService.create(dto);
  }
}
