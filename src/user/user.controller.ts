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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  /** if old password matches new password, update password */
  @Post(':uuid/change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async changePassword(
    @Param('uuid') uuid: string,
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
  @Post(':uuid/verify-address')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyAddress(
    @Param('uuid') uuid: string,
    @Body() verification_address_pin: string,
  ): Promise<void> {
    if (
      verification_address_pin == undefined ||
      verification_address_pin.length < 6
    ) {
      throw new UnprocessableEntityException(
        'verification_address_pin must be at least 5 characters',
      );
    }
    // Get user from the database
    const user = await this.userService.findOne({ uuid });
    // Verify that user provided pin and pin in database match
    if (user.verification_address_pin !== verification_address_pin) {
      throw new UnauthorizedException(
        'verification_address_pin does not match',
      );
    }
    // Mark address as verified
    await this.userService.patch(uuid, { verified_address: true });
  }

  /** Verify address code */
  @Post(':uuid/verify-email')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyEmail(
    @Param('uuid') uuid: string,
    @Body() verification_email_token: string,
  ): Promise<void> {
    if (verification_email_token == undefined) {
      throw new UnprocessableEntityException(
        'Expected verification_email_token',
      );
    }
    // Get user from the database
    const user = await this.userService.findOne({ uuid });
    // Verify that user provided pin and pin in database match
    if (user.verification_email_token !== verification_email_token) {
      throw new UnauthorizedException(
        'verification_email_token does not match',
      );
    }
    // Mark address as verified
    await this.userService.patch(uuid, { verified_email: true });
  }
}
