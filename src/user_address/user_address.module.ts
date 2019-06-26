import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAddressService } from './user_address.service';
import { UserAddress } from './user_address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  providers: [UserAddressService],
  exports: [UserAddressService],
})
export class UserAddressModule {}
