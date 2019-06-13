import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  Generated,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { DateTime, Duration } from 'luxon';

import { User } from '../user/user.entity';
import {
  TimestampTzTransformer,
  IntervalTransformer,
  DateTimeToString,
} from '../utils/transformers/';

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
  created_at: DateTime;

  @Column({
    type: 'interval',
    default: '1337 seconds',
    transformer: new IntervalTransformer(),
  })
  @Transform((val: Duration) => val.toISO())
  ttl: Duration;

  @ManyToOne(type => User, user => user.tokens, {
    cascade: true,
    nullable: false,
  })
  user: User;
}
