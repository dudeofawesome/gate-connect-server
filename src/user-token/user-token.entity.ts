import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { DateTime, Duration } from 'luxon';

import { User } from '../user/user.entity';
import {
  TimestampTzTransformer,
  IntervalTransformer,
  DateTimeToString,
} from '../utils/transformers/';
import { ConfigService } from '../config/config.service';

@Entity()
export class UserToken {
  @PrimaryColumn('text')
  authorization_token: string;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  created_at: DateTime;

  @Column({
    type: 'interval',
    default: ConfigService.getInstance().get('USER_TOKEN_TTL'),
    transformer: new IntervalTransformer(),
  })
  @Transform((val: Duration) => val.toISO())
  ttl: Duration;

  @ManyToOne(() => User, user => user.tokens, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;
}
