import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
  PointTransformer,
  PointToXY,
} from '../utils/transformers/';
import { GateGroup } from '../gate-group/gate-group.entity';
import { Point } from './point';

@Entity()
export class Gate {
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

  @Column({ type: 'point', transformer: new PointTransformer() })
  @Transform(PointToXY)
  location: Point;

  // TODO: this seems like the way to set a join column's name
  @ManyToOne(() => GateGroup, (gate_group: GateGroup) => gate_group.gates)
  @JoinColumn({ name: 'gate_group_uuid' })
  gate_group: GateGroup;
}
