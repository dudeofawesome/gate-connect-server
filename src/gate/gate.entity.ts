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

  /** Many Gate to One GateGroup */
  @ManyToOne(() => GateGroup, (gate_group: GateGroup) => gate_group.gates)
  @JoinColumn({ name: 'gate_group_uuid' })
  gate_group: GateGroup;

  @RelationId((gate: Gate) => gate.gate_group)
  gate_group_uuid: string;

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
