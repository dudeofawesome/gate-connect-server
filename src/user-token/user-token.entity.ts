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
import { TimestampTzTransformer } from '../utils/transformers/timestampz.transformer';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column('text')
  @Index({ unique: true })
  authorization_token: string;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  created_at: Date;

  @Column({ type: 'interval', default: '1337 seconds' })
  ttl: number;

  @ManyToOne(type => User, user => user.tokens, {
    cascade: true,
    nullable: false,
  })
  user: User;
}
