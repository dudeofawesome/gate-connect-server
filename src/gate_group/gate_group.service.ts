import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateGroup } from './gate_group.entity';

@Injectable()
export class GateGroupService {
  constructor(
    @InjectRepository(GateGroup)
    private readonly gate_groupRepository: Repository<GateGroup>,
  ) {}

  findAll(): Promise<GateGroup[]> {
    return this.gate_groupRepository.find();
  }

  create(gate_group: Partial<GateGroup>): Promise<GateGroup> {
    return this.gate_groupRepository.save<GateGroup>(this.gate_groupRepository.create(gate_group));
  }
}
