import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
} from '../utils/transformers';
import { GateGroupAddress } from '../gate_group_address';
import { User } from '../user/user.entity';

@Entity()
export class UserEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  created_at: DateTime;

  @UpdateDateColumn({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  updated_at: DateTime;

  @Column('text', { unique: true })
  @IsEmail()
  // @UserEditable() TODO: create this decorator
  email: string;

  @Column({ default: false })
  primary: boolean;

  @Column('text')
  verification_token: string;

  @Column({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  verification_sent_at: DateTime;

  @Column({ default: false })
  verified: boolean;

  /** Many UserEmail to One User */
  @ManyToOne(() => User, (user: User) => user.user_emails)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

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
