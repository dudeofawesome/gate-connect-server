import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
  HttpCode,
  Logger,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserAccess } from '../utils/guards/user-access.guard';
import { UserEmail } from '../user_email/user_email.entity';
import { UserEmailService } from './user_email.service';
import { UserParam } from '../utils/decorators/user.param.decorator';
import { User } from '../user/user.entity';
import { UserEmailInfoGuard } from '../utils/guards/user-email-info.guard';

@Controller('user-emails')
export class UserEmailController {
  constructor(private readonly user_email_service: UserEmailService) {}

  @Get()
  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(): Promise<UserEmail[]> {
    return this.user_email_service.findAll();
  }

  /** GET all of the email addresses belonging to :user_uuid */
  @Get(':user_uuid')
  // Verify user is logged in, Verify user_uuid matches logged in user's auth token
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  findByUserUUID(@Param('user_uuid') user_uuid: string): Promise<UserEmail[]> {
    try {
      return this.user_email_service.findByUserUUID(user_uuid);
    } catch (ex) {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    }
  }

  /** GET user_uuid's primary email address */
  @Get(':user_uuid/primary')
  // Verify user is logged in, Verify user_uuid matches logged in user's auth token
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  findPrimaryEmail(@Param('user_uuid') user_uuid: string): Promise<UserEmail> {
    try {
      return this.user_email_service.findPrimaryEmail(user_uuid);
    } catch (ex) {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    }
  }

  /** Create a new user email address */
  @Post()
  // Verify user is logged in, Verify user cannot change read only columns
  @UseGuards(AuthGuard(), UserEmailInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() user_email: Partial<UserEmail>,
    @UserParam() user: User,
  ): Promise<UserEmail> {
    return this.user_email_service.create({ ...user_email, user }).catch(ex => {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    });
  }

  /** Delete user address */
  @Delete(':user_email_uuid')
  // Verify user is logged in
  @UseGuards(AuthGuard())
  async delete(@Param('user_email_uuid') uuid: string): Promise<void> {
    await this.user_email_service.deleteUserEmail(uuid);
  }

  /** Verify email token */
  @Post(':user_email_uuid/verify-email')
  @HttpCode(200)
  @UseGuards(AuthGuard(), UserEmailInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyUserEmail(
    @Param('user_email_uuid') user_email_uuid: string,
    @Body() email_verification_token: string,
  ): Promise<void> {
    // Get user email
    const user_email = await this.user_email_service.findByUUID(
      user_email_uuid,
    );
    // Verify that user provided pin and pin in database match
    if (user_email.verification_token !== email_verification_token) {
      throw new UnauthorizedException('Invalid email verification pin');
    }
    // If we didn't throw anything, mark address as verified
    await this.user_email_service.patch(user_email_uuid, {
      verified: true,
    });
  }
}
