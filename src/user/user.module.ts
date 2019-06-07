import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';

export const passportModule = PassportModule.register({
  defaultStrategy: 'jwt',
});

@Module({
  imports: [TypeOrmModule.forFeature([User]), passportModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
