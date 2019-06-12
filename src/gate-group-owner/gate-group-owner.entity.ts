import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
  Index,
} from 'typeorm';
import { GateGroup } from '../gate-group/gate-group.entity';

@Entity()
export class GateGroupOwner {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

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

  @OneToMany(type => GateGroup, gate_group => gate_group.gate_group_owner)
  gate_groups: GateGroup[];
}
