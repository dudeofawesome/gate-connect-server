import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateGroup } from './gate-group.entity';

@Injectable()
export class GateGroupService {
  constructor(
    @InjectRepository(GateGroup)
    private readonly GateGroupRepository: Repository<GateGroup>,
  ) {}

  findAll(): Promise<GateGroup[]> {
    return this.GateGroupRepository.find();
  }

  create(gate-group: Partial<GateGroup>): Promise<GateGroup> {
    return this.GateGroupRepository.save<GateGroup>(this.GateGroupRepository.create(gate-group));
  }
}
