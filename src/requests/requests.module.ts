import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Requests } from './requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Requests])],
  providers: [RequestsService],
  controllers: [RequestsController],
})
export class RequestsModule {}
