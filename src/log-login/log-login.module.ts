import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogLoginService } from './log-login.service';
import { LogLoginController } from './log-login.controller';
import { LogLogin } from './log-login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LogLogin])],
  providers: [LogLoginService],
  controllers: [LogLoginController],
})
export class LogLoginModule {}
