import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateGroup } from './gate-group.entity';

@Injectable()
export class GateGroupService {
  constructor(
    @InjectRepository(GateGroup)
    private readonly gateGroupRepository: Repository<GateGroup>,
  ) {}

  findAll(): Promise<GateGroup[]> {
    return this.gateGroupRepository.find();
  }

  async findOneByUUID(
    uuid: string,
    include_gates: boolean = false,
  ): Promise<GateGroup> {
    return await this.gateGroupRepository.findOneOrFail({
      where: { uuid },
      relations: include_gates ? ['gates'] : [],
    });
  }

  create(gate_group: Partial<GateGroup>): Promise<GateGroup> {
    return this.gateGroupRepository.save<GateGroup>(
      this.gateGroupRepository.create(gate_group),
    );
  }
}
