import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEmailService, UserEmail } from '.';

@Module({
  imports: [TypeOrmModule.forFeature([UserEmail])],
  providers: [UserEmailService],
  exports: [UserEmailService],
})
export class UserEmailModule {}
