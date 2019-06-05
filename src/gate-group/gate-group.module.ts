import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GateGroupService } from './gate-group.service';
import { GateGroupController } from './gate-group.controller';
import { GateGroup } from './gate-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GateGroup])],
  providers: [GateGroupService],
  controllers: [GateGroupController],
})
export class GateGroupModule {}
