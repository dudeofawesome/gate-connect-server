import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Generated,
  Index,
} from 'typeorm';
import { GateGroup } from '../gate-group/gate-group.entity';

@Entity()
export class Gate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  @Generated('uuid')
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column('text')
  description: string;

  @Column('point')
  location: string;

  @ManyToOne(type => GateGroup, (gate_group: GateGroup) => gate_group.gates, {
    cascade: true,
  })
  gate_group: GateGroup;
}
