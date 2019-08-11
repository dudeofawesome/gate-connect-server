import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Transform, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { DateTime } from 'luxon';

import { TimestampTzTransformer } from '../utils/transformers/timestamptz.transformer';
import { DateTimeToString } from '../utils/transformers/class-transformers';
import { User } from '../user/user.entity';

@Entity()
export class UserEmail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

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

  @Column('text')
  @Exclude()
  verification_token: string;

  @Column({
    type: 'timestamptz',
    transformer: new TimestampTzTransformer(),
    nullable: true,
  })
  @Transform(DateTimeToString)
  verification_sent_at: DateTime;

  @Column({ default: false })
  verified: boolean;

  /** Many UserEmail to One User */
  @ManyToOne(() => User, (user: User) => user.emails)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @RelationId((entity: UserEmail) => entity.user)
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
