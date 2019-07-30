import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GateGroupAddress } from './gate-group-address.entity';
import { GateGroupAddressService } from './gate-group-address.service';
import { UserAddressModule } from '../user-address/user-address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GateGroupAddress]),
    forwardRef(() => UserAddressModule),
  ],
  providers: [GateGroupAddressService],
  exports: [GateGroupAddressService],
})
export class GateGroupAddressModule {}
