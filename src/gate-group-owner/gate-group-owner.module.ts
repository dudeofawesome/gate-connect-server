import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GateGroupOwnerService } from './gate-group-owner.service';
import { GateGroupOwnerController } from './gate-group-owner.controller';
import { GateGroupOwner } from './gate-group-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GateGroupOwner])],
  providers: [GateGroupOwnerService],
  controllers: [GateGroupOwnerController],
})
export class GateGroupOwnerModule {}
