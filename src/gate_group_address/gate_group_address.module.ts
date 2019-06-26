import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GateGroupAddressService, GateGroupAddress } from '.';

@Module({
  imports: [TypeOrmModule.forFeature([GateGroupAddress])],
  providers: [GateGroupAddressService],
  exports: [GateGroupAddressService],
})
export class GateGroupAddressModule {}
