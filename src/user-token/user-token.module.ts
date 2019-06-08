import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTokenService } from './user-token.service';
import { UserTokenController } from './user-token.controller';
import { UserToken } from './user-token.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToken]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserTokenService],
  controllers: [UserTokenController],
  exports: [UserTokenService],
})
export class UserTokenModule {}
