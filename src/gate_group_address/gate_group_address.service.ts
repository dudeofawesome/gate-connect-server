import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateGroupAddress } from './gate_group_address.entity';
import { GateGroup } from '../gate-group';
import { UserAddress } from '../user_address/user_address.entity';
import { compareTwoStrings } from 'string-similarity';
import { UserAddressService } from '../user_address/user_address.service';

@Injectable()
export class GateGroupAddressService {
  constructor(
    @InjectRepository(GateGroupAddress)
    private readonly gateGroupAddressRepository: Repository<GateGroupAddress>,
    private readonly user_address_service: UserAddressService,
  ) {}

  findAll(): Promise<GateGroupAddress[]> {
    return this.gateGroupAddressRepository.find();
  }

  create(
    partial_gate_group_address: Partial<GateGroupAddress>,
  ): Promise<GateGroupAddress> {
    const gate_group_address = this.gateGroupAddressRepository.save<
      GateGroupAddress
    >(this.gateGroupAddressRepository.create(partial_gate_group_address));
    // Now that we've added a new GateGroupAddress, we will search
    // all the UserAddresses to see if any of them match
    this.user_address_service.linkAllToGateGroupAddress();
    return gate_group_address;
  }

  async getGateGroup(uuid: string): Promise<GateGroup> {
    return this.gateGroupAddressRepository
      .findOneOrFail({
        where: { uuid },
        relations: ['gate_group'],
      })
      .then(gate_group_address => gate_group_address.gate_group);
  }
}
