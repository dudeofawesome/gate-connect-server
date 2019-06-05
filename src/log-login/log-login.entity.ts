import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {User} from "./user.entity"

@Entity()
export class LogLogin {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('timestamptz')
  time: Date;

  // ManyToOne: user_id
  @ManyToOne(type => User, user.logins)
  user: User;
}

