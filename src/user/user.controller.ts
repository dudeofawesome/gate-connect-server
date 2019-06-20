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
  InternalServerErrorException,
  UnprocessableEntityException,
  ConflictException,
  Put,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { hash } from 'argon2';
import { QueryFailedError, DeepPartial } from 'typeorm';

import { UserService, User } from '../user';
import { AuthService } from '../auth';
import { QueryFailedErrorFull } from '../types/query-failed-error-full';
import { UserParam } from '../utils/decorators';
import { NoAuthGuard } from '../utils/guards/no-auth.guard';

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
  async getSelf(@UserParam() user: User): Promise<User> {
    return user;
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(@Param('uuid') uuid: string): Promise<User> {
    try {
      return await this.userService.findOneByUUID(uuid);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Unknown error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post()
  @UseGuards(NoAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  // @UsePipes(new ValidationPipe())
  async create(@Body() body: User): Promise<User> {
    return this.userService
      .create({
        ...body,
        password: await hash(body.password),
      })
      .catch(err => {
        if (err instanceof QueryFailedError) {
          err = err as QueryFailedErrorFull;
          if (err.detail.startsWith('Key (email)=(')) {
            throw new ConflictException('Email already registered');
          } else {
            throw new InternalServerErrorException();
          }
        } else {
          throw new InternalServerErrorException();
        }
      });
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async patch(
    @Param('uuid') uuid: string,
    @Body() body: Partial<User>,
  ): Promise<User> {
    const update_res = await this.userService.patch(uuid, body);
    return this.userService.findOneByUUID(uuid);
  }
}
