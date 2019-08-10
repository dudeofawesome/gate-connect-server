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
import { UserEmail } from './user-email.entity';
import { UserEmailService } from './user-email.service';
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
  @Get(':email_uuid')
  // Verify user is logged in, Verify user_uuid matches logged in user's auth token
  @UseGuards(AuthGuard(), UserAccess)
  @UseInterceptors(ClassSerializerInterceptor)
  findByUserUUID(@Param('email_uuid') email_uuid: string): Promise<UserEmail> {
    try {
      return this.user_email_service.findByUUID(email_uuid);
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
    return this.user_email_service.create(user_email, user).catch(ex => {
      Logger.error(ex);
      throw new InternalServerErrorException('Unknown error');
    });
  }

  /** Delete user address */
  @Delete(':user_email_uuid')
  // Verify user is logged in
  @UseGuards(AuthGuard())
  async delete(
    @Param('user_email_uuid') user_email_uuid: string,
  ): Promise<void> {
    await this.user_email_service.deleteUserEmail(user_email_uuid);
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

  /** Set this email to primary */
  @Post(':user_email_uuid/make-primary')
  @HttpCode(200)
  @UseGuards(AuthGuard(), UserEmailInfoGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async makePrimary(
    @Param('user_email_uuid') user_email_uuid: string,
    @UserParam() user: User,
  ): Promise<void> {
    // Set the currently primary email to not primary
    const current_primary_email = await this.user_email_service.findPrimaryEmail(
      user.uuid,
    );
    this.user_email_service.patch(current_primary_email.uuid, {
      primary: false,
    });

    // Now set the requested one to primary
    this.user_email_service.patch(user_email_uuid, {
      primary: true,
    });
  }
}
