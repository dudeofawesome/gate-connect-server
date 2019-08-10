import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
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

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { QueryFailedErrorFull } from '../types/query-failed-error-full';
import { UserParam } from '../utils/decorators';
import { NoAuthGuard } from '../utils/guards/no-auth.guard';
import { UserInfoGuard } from '../utils/guards/user-info.guard';
import { PasswordChangeDTO } from './password-change-dto';
import { UserAccess } from '../utils/guards/user-access.guard';
import { UserEmail } from '../user-email/user-email.entity';
import { UserEmailService } from '../user-email/user-email.service';
import { GateGroup } from '../gate-group/gate-group.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userEmailService: UserEmailService,
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

  /** Get GateGroups belonging to user */
  @Get(':user_uuid/gate-groups')
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  async getGateGroups(
    @Param('user_uuid') user_uuid: string,
  ): Promise<GateGroup[]> {
    return this.userService.getGateGroups(user_uuid);
  }

  @Get(':user_uuid')
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUID(
    @Param('user_uuid') uuid: string,
    @Query('include-emails') includeEmails: boolean = false,
    @Query('include-addresses') includeAddresses: boolean = false,
    @Query('include-gates') includeGates: boolean = false,
    @Query('include-tokens') includeTokens: boolean = false,
  ): Promise<User> {
    const relations: string[] = [];
    if (includeGates) {
      includeAddresses = true;
    }

    if (includeEmails) {
      relations.push('emails');
    }
    if (includeAddresses) {
      relations.push('addresses');
    }
    if (includeGates) {
      relations.push('addresses.gate_group_address');
      relations.push('addresses.gate_group_address.gate_group');
      relations.push('addresses.gate_group_address.gate_group.gates');
    }
    if (includeTokens) {
      relations.push('tokens');
    }

    try {
      return await this.userService.findOneByUUID(uuid, relations);
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

  @Get(':user_uuid/emails')
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async getEmails(@Param('user_uuid') uuid: string): Promise<UserEmail[]> {
    try {
      return await this.userEmailService.findByUserUUID(uuid);
    } catch (ex) {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    }
  }

  @Get(':user_uuid/emails')
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPrimaryEmail(
    @Param('user_uuid') user_uuid: string,
  ): Promise<UserEmail> {
    try {
      return await this.userEmailService.findPrimaryEmail(user_uuid);
    } catch (ex) {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    }
  }

  @Post(':user_uuid/relations')
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByUUIDWithRelations(
    @Param('user_uuid') uuid: string,
    @Body() relations: string[],
  ): Promise<User> {
    // TODO: Flutter won't allow array literals in the request body
    if (typeof relations === 'object') {
      relations = relations.flutter_is_broken.split(',');
    }
    try {
      return await this.userService.findOneByUUID(uuid, relations);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        // Logger.error(ex);
        console.log(ex);
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
  async create(@Body() user: any): Promise<User> {
    let response = await this.userService.create({
      ...user,
      password: await hash(user.password),
    });
    // TODO: fix the possibility that creating the user succeeds but the email fails
    await this.userEmailService
      .create({ email: user.email }, response)
    return response;
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
}
