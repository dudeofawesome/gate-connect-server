import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Gate } from '../gate/gate.entity';
import { GateGroupOwner } from '../gate-group-owner/gate-group-owner.entity';

@Entity()
export class GateGroup {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column('text')
  description: string;

  @OneToMany(type => Gate, (gate: Gate) => gate.gate_group)
  gates: Gate[];

  @ManyToOne(
    type => GateGroupOwner,
    gate_group_owner => gate_group_owner.gate_groups,
  )
  gate_group_owner: GateGroupOwner;
}
