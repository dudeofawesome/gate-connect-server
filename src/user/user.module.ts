import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule, passportModule } from '../auth/auth.module';
import { UserEmailModule } from '../user-email/user-email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    passportModule,
    forwardRef(() => AuthModule),
    UserEmailModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
