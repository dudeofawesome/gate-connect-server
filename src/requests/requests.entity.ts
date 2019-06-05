import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  time: Date;

  // ManyToMany: user_id, gate_id
}
