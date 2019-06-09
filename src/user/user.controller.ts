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
  Headers,
  Logger,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UserService, User } from '../user';
import { AuthService, JwtPayload } from '../auth';
import { QueryFailedError } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/self')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async getSelf(@Req() req: Request): Promise<User> {
    return req.user as User;
  }

  @Get(':uuid')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(@Param('uuid') uuid: string): Promise<User> {
    try {
      return await this.userService.findOneByUUID(uuid);
    } catch (ex) {
      switch (ex.constructor) {
        case QueryFailedError:
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            'Unknown error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  // @UsePipes(new ValidationPipe())
  create(@Body() body: User): Promise<User> {
    return this.userService.create(body);
  }
}
