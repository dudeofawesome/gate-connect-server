import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddressService } from './user-address.service';
import { UserAddress } from './user-address.entity';
import { UserAddressController } from './user-address.controller';
import { AuthModule, passportModule } from '../auth/auth.module';
import { GateGroupAddressModule } from '../gate-group-address/gate-group-address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddress]),
    passportModule,
    forwardRef(() => AuthModule),
    forwardRef(() => GateGroupAddressModule),
  ],
  providers: [UserAddressService],
  controllers: [UserAddressController],
  exports: [UserAddressService],
})
export class UserAddressModule {}
