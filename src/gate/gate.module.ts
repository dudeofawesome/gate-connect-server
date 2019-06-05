import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GateService } from './gate.service';
import { GateController } from './gate.controller';
import { Gate } from './gate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gate])],
  providers: [GateService],
  controllers: [GateController],
})
export class GateModule {}
