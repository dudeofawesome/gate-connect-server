import { Injectable } from '@nestjs/common';

@Injectable()
export class HologramService {
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
