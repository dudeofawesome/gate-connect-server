import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GateGroupService, GateGroupController, GateGroup } from './';
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
