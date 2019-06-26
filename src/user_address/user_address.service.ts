import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly user_address_repository: Repository<UserAddress>,
  ) {}

  /** Find address by uuid */
  findByUUID(uuid: string): Promise<UserAddress> {
    return this.user_address_repository.findOneOrFail({
      where: uuid,
    });
  }

  /** Return all addresses belonging to user_uuid */
  findByUserUUID(user_uuid: string): Promise<UserAddress[]> {
    return this.user_address_repository.find({
      where: { user_uuid },
    });
  }

  create(user_address: Partial<UserAddress>): Promise<UserAddress> {
    return this.userAddressRepository.save<UserAddress>(
      this.userAddressRepository.create(user_address),
    );
  }
}
