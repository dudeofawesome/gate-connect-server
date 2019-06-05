import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GateGroupService } from './gate_group_group.service';
import { GateGroupController } from './gate_group_group.controller';
import { GateGroup } from './gate_group_group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GateGroup])],
  providers: [GateGroupService],
  controllers: [GateGroupController],
})
export class GateGroupModule {}
