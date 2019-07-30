import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Transform, Exclude } from 'class-transformer';
import { DateTime } from 'luxon';

import { TimestampTzTransformer } from '../utils/transformers/timestamptz.transformer';
import { DateTimeToString } from '../utils/transformers/class-transformers';
import { GateGroupAddress } from '../gate-group-address/gate-group-address.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserAddress {
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
  premise: string;

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

  @Column('text')
  @Exclude()
  verification_pin: string;

  @Column({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
    nullable: true,
  })
  @Transform(DateTimeToString)
  verification_sent_at: DateTime;

  @Column({ default: false })
  verified: boolean;

  /** Many UserAddress to One GateGroupAddress */
  @ManyToOne(
    () => GateGroupAddress,
    (gate_group_address: GateGroupAddress) => gate_group_address.user_addresses,
  )
  @JoinColumn({ name: 'gate_group_address_uuid' })
  gate_group_address: GateGroupAddress;

  @RelationId((entity: UserAddress) => entity.gate_group_address)
  gate_group_address_uuid: string;

  /** Many UserAddress to One User */
  @ManyToOne(() => User, (user: User) => user.addresses)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @RelationId((entity: UserAddress) => entity.user)
  user_uuid: string;

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
