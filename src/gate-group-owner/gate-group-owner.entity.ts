import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
} from '../utils/transformers/';
import { GateGroup } from '../gate-group/gate-group.entity';

@Entity()
export class GateGroupOwner {
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

  @Column('text')
  description: string;

  @Column('text')
  name: string;

  @Column('text')
  phone: string;

  @Column('text')
  email: string;

  @Column('text')
  address: string;

  /** One GateGroupOwner to Many GateGroup */
  @OneToMany(() => GateGroup, gate_group => gate_group.gate_group_owner)
  gate_groups: GateGroup[];

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
