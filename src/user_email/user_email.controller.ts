import {
  Controller,
} from '@nestjs/common';
import { UserEmailService } from './user_email.service';

@Controller('user_addresses')
export class UserEmailController {
  constructor(private readonly user_email_service: UserEmailService) {}
}
