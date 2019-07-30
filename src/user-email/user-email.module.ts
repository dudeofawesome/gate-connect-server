import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEmailService } from './user-email.service';
import { UserEmail } from './user-email.entity';
import { UserEmailController } from './user-email.controller';
import { AuthModule, passportModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEmail]),
    passportModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserEmailService],
  controllers: [UserEmailController],
  exports: [UserEmailService],
})
export class UserEmailModule {}
