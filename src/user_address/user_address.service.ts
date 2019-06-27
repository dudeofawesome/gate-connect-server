import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';
import { RandomString } from 'secure-random-value';

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

  /** Create user_address */
  async create(user_address: Partial<UserAddress>): Promise<UserAddress> {
    return this.user_address_repository.save<UserAddress>(
      // TODO: define UserAddress.gate_group_address_uuid
      this.user_address_repository.create({
        ...user_address,
        verification_pin: await RandomString(4, 'alpha_upper'),
      }),
    );
  }

  /** Delete address */
  async deleteUserAddress(uuid: string): Promise<void> {
    await this.user_address_repository.delete(uuid);
  }

  /** Update user address  */
  async patch(uuid: string, user_address: Partial<UserAddress>): Promise<void> {
    await this.user_address_repository.update(uuid, user_address);
  }
}
