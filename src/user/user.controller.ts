import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @UseInterceptors(ClassSerializerInterceptor)
  findOneByUUID(@Param('uuid') uuid: string): Promise<User> {
    return this.userService.findOneByUUID(uuid);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() body: Partial<User>): Promise<User> {
    return this.userService.create(body);
  }
}
