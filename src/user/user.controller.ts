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
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { hash } from 'argon2';

import { UserService, User } from '../user';
import { AuthService } from '../auth';
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
  // TODO: disallow authed requests
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
          if (((err as any).detail as string).startsWith('Key (email)=(')) {
            throw new ConflictException('Email already registered');
          } else {
            throw new InternalServerErrorException();
          }
        } else {
          throw new InternalServerErrorException();
        }
      });
  }
}
