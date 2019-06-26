import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEmailService } from './user_email.service';
import { UserEmail } from './user_email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEmail])],
  providers: [UserEmailService],
  exports: [UserEmailService],
})
export class UserEmailModule {}
