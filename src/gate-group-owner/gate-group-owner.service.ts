import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GateGroupOwner } from './gate-group-owner.entity';

@Injectable()
export class GateGroupOwnerService {
  constructor(
    @InjectRepository(GateGroupOwner)
    private readonly gateGroupOwnerRepository: Repository<GateGroupOwner>,
  ) {}

  findAll(): Promise<GateGroupOwner[]> {
    return this.gateGroupOwnerRepository.find();
  }

  async findOneByUUID(uuid: string): Promise<GateGroupOwner> {
    return await this.gateGroupOwnerRepository.findOneOrFail({
      where: { uuid },
    });
  }

  create(gate_group_owner: Partial<GateGroupOwner>): Promise<GateGroupOwner> {
    return this.gateGroupOwnerRepository.save<GateGroupOwner>(
      this.gateGroupOwnerRepository.create(gate_group_owner),
    );
  }
}
