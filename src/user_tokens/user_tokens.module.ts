import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokensService } from './user_tokens.service';
import { UserTokensController } from './user_tokens.controller';
import { UserTokens } from './user_tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTokens])],
  providers: [UserTokensService],
  controllers: [UserTokensController],
})
export class UserTokensModule {}
