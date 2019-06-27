import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateGroupAddress } from './gate_group_address.entity';
import { GateGroup } from '../gate-group';
import { UserAddress } from '../user_address/user_address.entity';
import { compareTwoStrings } from 'string-similarity';

@Injectable()
export class GateGroupAddressService {
  constructor(
    @InjectRepository(GateGroupAddress)
    private readonly gateGroupAddressRepository: Repository<GateGroupAddress>,
  ) {}

  findAll(): Promise<GateGroupAddress[]> {
    return this.gateGroupAddressRepository.find();
  }

  create(
    gate_group_address: Partial<GateGroupAddress>,
  ): Promise<GateGroupAddress> {
    return this.gateGroupAddressRepository.save<GateGroupAddress>(
      this.gateGroupAddressRepository.create(gate_group_address),
    );
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
