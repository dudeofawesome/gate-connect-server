import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateGroupOwner } from './gate-group-owner.entity';

@Injectable()
export class GateGroupOwnerService {
  constructor(
    @InjectRepository(GateGroupOwner)
    private readonly GateGroupOwnerRepository: Repository<GateGroupOwner>,
  ) {}

  findAll(): Promise<GateGroupOwner[]> {
    return this.GateGroupOwnerRepository.find();
  }

  create(gate_group_owner: Partial<GateGroupOwner>): Promise<GateGroupOwner> {
    return this.GateGroupOwnerRepository.save<GateGroupOwner>(
      this.GateGroupOwnerRepository.create(gate_group_owner),
    );
  }
}
