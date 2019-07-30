import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
} from '../utils/transformers';
import { GateGroup } from '../gate-group/gate-group.entity';
import { UserAddress } from '../user_address/user_address.entity';

@Entity()
export class GateGroupAddress {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  created_at: DateTime;

  @UpdateDateColumn({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  updated_at: DateTime;

  /** Apartment, Suite, Box number, etc. */
  @Column('text')
  premise_range: string;

  /** Street address */
  @Column('text')
  thoroughfare: string;

  /** City / Town */
  @Column('text')
  locality: string;

  /** Postal code / ZIP Code */
  @Column('text')
  postal_code: string;

  /** State / Province / Region (Use ISO code when available) */
  @Column('text')
  administrative_area: string;

  /** Many GateGroupAddress to One GateGroup */
  @ManyToOne(
    () => GateGroup,
    (gate_group: GateGroup) => gate_group.gate_group_addresses,
  )
  @JoinColumn({ name: 'gate_group_uuid' })
  gate_group: GateGroup;

  @RelationId((entity: GateGroupAddress) => entity.gate_group)
  gate_group_uuid: string;

  /** One GateGroupAddress to Many UserAddress */
  @OneToMany(
    () => UserAddress,
    (user_address: UserAddress) => user_address.gate_group_address,
  )
  user_addresses: UserAddress[];

  // Put this in the "Many" entity
  /** Many B to One A */
  // @ManyToOne(() => A, (a: A) => a.bs)
  // @JoinColumn({ name: 'a_uuid' })
  // a: A;

  // Put this in the "One" entity
  /** One A to Many B */
  // @OneToMany(() => B, (b: B) => b.a)
  // bs: B[];
}
