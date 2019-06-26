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

  findAll(): Promise<UserAddress[]> {
    return this.userAddressRepository.find();
  }

  create(user_address: Partial<UserAddress>): Promise<UserAddress> {
    return this.userAddressRepository.save<UserAddress>(
      this.userAddressRepository.create(user_address),
    );
  }
}
