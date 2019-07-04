import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';
import { RandomString } from 'secure-random-value';
import { GateGroupAddressService } from '../gate_group_address/gate_group_address.service';
import { GateGroupAddress } from '../gate_group_address/gate_group_address.entity';
import { compareTwoStrings } from 'string-similarity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly user_address_repository: Repository<UserAddress>,
    @Inject(forwardRef(() => GateGroupAddressService))
    private readonly gate_group_address_service: GateGroupAddressService,
  ) {}

  /** Find address by uuid */
  findByUUID(uuid: string): Promise<UserAddress> {
    return this.user_address_repository.findOneOrFail({
      where: uuid,
    });
  }

  /** Try to match each unmatched UserAddress to a GateGroupAddress */
  async linkAllToGateGroupAddress(): Promise<void> {
    (await this.findUnlinked()).forEach(user_address => {
      this.linkToGateGroupAddress(user_address);
    });
  }

  /** Try to match user_address to a GroupAddress */
  async linkToGateGroupAddress(
    user_address: Partial<UserAddress>,
  ): Promise<void> {
    // Require a uuid for patching
    if (user_address.uuid == null) {
      throw new BadRequestException('Request must contain user_address.uuid');
    }
    // Search for best match
    const gate_group_address = await this.findGateGroupAddress(user_address);
    if (gate_group_address != null) {
      return this.patch(user_address.uuid, {
        ...user_address,
        gate_group_address,
      });
    }
    return this.patch(user_address.uuid, user_address);
  }

  /** Find addresses that haven't been linked to a GateGroupAddress */
  findUnlinked(): Promise<UserAddress[]> {
    return this.user_address_repository.find({
      where: {
        gate_group: null,
      },
    });
  }

  /** Return all addresses belonging to user_uuid */
  findByUserUUID(user_uuid: string): Promise<UserAddress[]> {
    return this.user_address_repository.find({
      where: { user_uuid },
    });
  }

  /** Create user_address */
  async create(user_address: Partial<UserAddress>): Promise<UserAddress> {
    const gate_group_address = await this.findGateGroupAddress(user_address);
    return this.user_address_repository.save<UserAddress>(
      this.user_address_repository.create({
        ...user_address,
        verification_pin: await RandomString(4, 'alpha_upper'),
        gate_group_address,
      }),
    );
  }

  /** Return the closest GateGroupAddress to given UserAddress */
  async findGateGroupAddress(
    user_address: Partial<UserAddress>,
  ): Promise<GateGroupAddress | undefined> {
    const required_confidence = 0.7;
    // Get all GateGroupAddresses
    const gate_group_addresses = await this.gate_group_address_service.findAll();
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
        user_address.postal_code != null &&
        gate_group_address.postal_code != null &&
        user_address.postal_code.split('-')[0].toLowerCase() ===
          gate_group_address.postal_code.split('-')[0].toLowerCase() &&
        user_address.administrative_area != null &&
        gate_group_address.administrative_area != null &&
        user_address.administrative_area.toLowerCase() ===
          gate_group_address.administrative_area.toLowerCase() &&
        user_address.premise != null &&
        user_address.thoroughfare != null &&
        user_address.locality != null &&
        parseInt(user_address.premise) >= parseInt(min_premise) &&
        parseInt(user_address.premise) <= parseInt(max_premise)
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
    Logger.log({
      UserAddress,
      closest_match: best_gate_group_address,
      confidence_level: best_confidence,
      match: best_confidence > required_confidence,
    });
    if (best_confidence > required_confidence) {
      return;
    }
    return best_gate_group_address;
  }

  /** Delete address */
  async deleteUserAddress(uuid: string): Promise<void> {
    await this.user_address_repository.delete(uuid);
  }

  /** Update user address  */
  async patch(uuid: string, user_address: Partial<UserAddress>): Promise<void> {
    await this.user_address_repository.update(uuid, user_address);
  }
}
