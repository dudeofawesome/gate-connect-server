import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  GateGroupOwnerService,
  GateGroupOwnerController,
  GateGroupOwner,
} from './';
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
