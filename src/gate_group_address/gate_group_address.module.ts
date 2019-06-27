import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GateGroupAddressService, GateGroupAddress } from '.';
import { UserAddressModule } from '../user_address/user_address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GateGroupAddress]),
    forwardRef(() => UserAddressModule),
  ],
  providers: [GateGroupAddressService],
  exports: [GateGroupAddressService],
})
export class GateGroupAddressModule {}
