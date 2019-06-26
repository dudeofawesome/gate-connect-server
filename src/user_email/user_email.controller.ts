import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  UseGuards,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserAccess } from '../utils/guards/user-access.guard';
import { UserEmail } from '../user_email/user_email.entity';
import { UserEmailService } from './user_email.service';

@Controller('user_addresses')
export class UserEmailController {
  constructor(private readonly user_email_service: UserEmailService) {}

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
}
