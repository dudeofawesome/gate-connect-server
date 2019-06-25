import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UseGuards,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  UnprocessableEntityException,
  ConflictException,
  Patch,
  UnauthorizedException,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { hash, verify } from 'argon2';
import { QueryFailedError } from 'typeorm';

import { UserService, User } from '../user';
import { AuthService } from '../auth';
import { QueryFailedErrorFull } from '../types/query-failed-error-full';
import { UserParam } from '../utils/decorators';
import { NoAuthGuard } from '../utils/guards/no-auth.guard';
import { UserInfoGuard } from '../utils/guards/user-info.guard';
import { PasswordChangeDTO } from './password-change-dto';
import { UserAccess } from '../utils/guards/user-access.guard';

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

  @Get(':user_uuid')
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(@Param('uuid') uuid: string): Promise<User> {
    try {
      return await this.userService.findOneByUUID(uuid);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        Logger.error(ex);
        throw new HttpException(
          'Unknown error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post()
  @UseGuards(NoAuthGuard, UserInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() user: User): Promise<User> {
    return this.userService
      .create({
        ...user,
        password: await hash(user.password),
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

  @Patch(':user_uuid')
  @UseGuards(AuthGuard(), UserInfoGuard, UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async patch(
    @Param('user_uuid') uuid: string,
    @Body() user: Partial<User>,
  ): Promise<User> {
    if (user.password != null) {
      throw new UnprocessableEntityException(
        'Cannot change user.password in a full user patch',
      );
    }

    await this.userService.patch(uuid, user);
    return this.userService.findOneByUUID(uuid);
  }

  /** Update user password */
  @Post(':user_uuid/change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async changePassword(
    @Param('user_uuid') uuid: string,
    @Body() password_dto: PasswordChangeDTO,
  ): Promise<void> {
    if (
      password_dto.new_password == undefined ||
      password_dto.old_password == undefined
    ) {
      throw new UnprocessableEntityException(
        'Expected old_password and new_password',
      );
    }
    // Get user from the database
    const user = await this.userService.findOne({ uuid });
    // Verify old_password and current password match (argon2)
    if (!(await verify(user.password, password_dto.old_password))) {
      throw new UnauthorizedException('old_password does not match');
    }
    // hash new password and patch it in the database
    await this.userService.patch(uuid, {
      password: await hash(password_dto.new_password),
    });
  }

  /** Verify address code */
  @Post(':user_uuid/verify-address')
  @HttpCode(200)
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyAddress(
    @Param('user_uuid') uuid: string,
    @Body() verification_address_pin: string,
  ): Promise<void> {
    // Get user from the database
    const user = await this.userService.findOne({ uuid });
    // Verify that user provided pin and pin in database match
    if (user.verification_address_pin !== verification_address_pin) {
      throw new UnauthorizedException('Invalid address verification pin');
    }
    // Mark address as verified
    await this.userService.patch(uuid, { verified_address: true });
  }

  /** Verify address code */
  @Post(':user_uuid/verify-email')
  @HttpCode(200)
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyEmail(
    @Param('user_uuid') uuid: string,
    @Body() verification_email_token: string,
  ): Promise<void> {
    // Get user from the database
    const user = await this.userService.findOne({ uuid });
    // Verify that user provided pin and pin in database match
    if (user.verification_email_token !== verification_email_token) {
      throw new UnauthorizedException('Invalid email verification token');
    }
    // Mark address as verified
    await this.userService.patch(uuid, { verified_email: true });
  }
}
