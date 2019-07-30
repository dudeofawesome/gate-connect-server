import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GateGroup } from './gate-group.entity';
import { GateGroupController } from './gate-group.controller';
import { GateGroupService } from './gate-group.service';
import { AuthModule, passportModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GateGroup]),
    passportModule,
    forwardRef(() => AuthModule),
  ],
  providers: [GateGroupService],
  controllers: [GateGroupController],
  exports: [GateGroupService],
})
export class GateGroupModule {}
