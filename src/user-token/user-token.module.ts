import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenService } from './user-token.service';
import { UserTokenController } from './user-token.controller';
import { UserToken } from './user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [UserTokenService],
  controllers: [UserTokenController],
})
export class UserTokenModule {}
