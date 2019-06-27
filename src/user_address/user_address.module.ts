import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddressService } from './user_address.service';
import { UserAddress } from './user_address.entity';
import { UserAddressController } from './user_address.controller';
import { AuthModule, passportModule } from '../auth/auth.module';
import { GateGroupAddressModule } from '../gate_group_address/gate_group_address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddress]),
    passportModule,
    forwardRef(() => AuthModule),
    GateGroupAddressModule,
  ],
  providers: [UserAddressService],
  controllers: [UserAddressController],
  exports: [UserAddressService],
})
export class UserAddressModule {}
