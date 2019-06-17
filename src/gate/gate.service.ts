import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gate } from './gate.entity';
import { GateGroup } from '../gate-group';

@Injectable()
export class GateService {
  constructor(
    @InjectRepository(Gate)
    private readonly gateRepository: Repository<Gate>,
  ) {}

  findAll(): Promise<Gate[]> {
    return this.gateRepository.find();
  }

  create(gate: Partial<Gate>): Promise<Gate> {
    return this.gateRepository.save<Gate>(this.gateRepository.create(gate));
  }

  async getGateGroup(uuid: string): Promise<GateGroup> {
    return this.gateRepository
      .findOneOrFail({
        where: { uuid },
        relations: ['gate_group'],
      })
      .then(gate => gate.gate_group);
  }
}
