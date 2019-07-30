import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  RelationId,
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

  /** Many UserToken to One User */
  @ManyToOne(() => User, user => user.tokens, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @RelationId((entity: UserToken) => entity.user)
  user_uuid: string;

  // Put this in the "Many" entity
  /** Many B to One A */
  // @ManyToOne(() => A, (a: A) => a.bs)
  // @JoinColumn({ name: 'a_uuid' })
  // a: A;

  // Put this in the "One" entity
  /** One A to Many B */
  // @OneToMany(() => B, (b: B) => b.a)
  // bs: B[];
}
