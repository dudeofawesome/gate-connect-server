import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEmailService } from './user_email.service';
import { UserEmail } from './user_email.entity';
import { AuthModule, passportModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEmail]),
    passportModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserEmailService],
  exports: [UserEmailService],
})
export class UserEmailModule {}
