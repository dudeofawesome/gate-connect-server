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

  /** Return the closest GateGroupAddress to given UserAddress */
  async find(user_address: Partial<UserAddress>): Promise<GateGroupAddress> {
    const required_confidence = 0.7;
    const gate_group_addresses = await this.findAll();
    let best_gate_group_address;
    let best_confidence = 0;
    gate_group_addresses.forEach(gate_group_address => {
      // We need to make sure ranges are always stored as 000a-999z
      // Get premise range from GateGroupAddress
      const range = gate_group_address.premise_range;
      const min_premise = range.split('-')[0];
      const max_premise = range.split('-')[1];
      // Make sure zip code and state match, and address is within range
      if (
        user_address.postal_code === gate_group_address.postal_code &&
        user_address.administrative_area ===
          gate_group_address.administrative_area &&
        user_address.premise != null &&
        user_address.thoroughfare != null &&
        user_address.locality != null &&
        user_address.premise >= min_premise &&
        user_address.premise <= max_premise
      ) {
        // Build street + city string and get a confidence level between them
        const user_address_string =
          user_address.thoroughfare + user_address.locality;
        const gate_group_address_string =
          gate_group_address.thoroughfare + gate_group_address.locality;
        const confidence = compareTwoStrings(
          user_address_string.replace(/\W/g, '').toLowerCase(),
          gate_group_address_string.replace(/\W/g, '').toLowerCase(),
        );
        // Set best confidence if we find a better one
        if (confidence > best_confidence) {
          best_confidence = confidence;
          best_gate_group_address = gate_group_address;
        }
      }
    });
    // The || is there for TypeScript
    if (
      best_confidence > required_confidence ||
      best_gate_group_address == null
    ) {
      throw new NotFoundException();
    }
    return best_gate_group_address;
  }

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
