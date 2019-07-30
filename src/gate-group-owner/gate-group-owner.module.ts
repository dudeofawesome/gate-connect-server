import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GateGroupOwner } from './gate-group-owner.entity';
import { GateGroupOwnerController } from './gate-group-owner.controller';
import { GateGroupOwnerService } from './gate-group-owner.service';
import { AuthModule, passportModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GateGroupOwner]),
    passportModule,
    forwardRef(() => AuthModule),
  ],
  providers: [GateGroupOwnerService],
  controllers: [GateGroupOwnerController],
  exports: [GateGroupOwnerService],
})
export class GateGroupOwnerModule {}
