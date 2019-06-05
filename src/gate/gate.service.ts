import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gate } from './gate.entity';

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
}
