import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginsService } from './logins.service';
import { LoginsController } from './logins.controller';
import { Logins } from './logins.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Logins])],
  providers: [LoginsService],
  controllers: [LoginsController],
})
export class LoginsModule {}
