import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Logins {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  time: Date;

  // ManyToOne: user_id
}
