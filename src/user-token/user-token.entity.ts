import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  Generated,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '../user/user.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  // @Column()
  // @Index({ unique: true })
  // @Generated('uuid')
  // @Exclude()
  // uuid: string;

  @Column('text')
  @Index({ unique: true })
  authorization_token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'interval', default: '1337 seconds' })
  ttl: number;

  @ManyToOne(type => User, user => user.tokens, {
    cascade: true,
    nullable: false,
  })
  user: User;
}
