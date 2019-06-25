import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
} from '../utils/transformers/';
import { Gate } from '../gate/gate.entity';
import { GateGroupOwner } from '../gate-group-owner/gate-group-owner.entity';

@Entity()
export class GateGroup {
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

  @OneToMany(() => Gate, (gate: Gate) => gate.gate_group)
  gates: Gate[];

  @ManyToOne(
    () => GateGroupOwner,
    gate_group_owner => gate_group_owner.gate_groups,
  )
  @JoinColumn({ name: 'gate_group_owner_uuid' })
  gate_group_owner: GateGroupOwner;
}
