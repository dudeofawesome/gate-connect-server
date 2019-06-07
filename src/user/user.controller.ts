import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
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
  // @UsePipes(new ValidationPipe())
  create(@Body() body: User): Promise<User> {
    return this.userService.create(body);
  }
}
