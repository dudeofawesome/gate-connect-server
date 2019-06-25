import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
} from '../utils/transformers/';
import { UserToken } from '../user-token/user-token.entity';
import { GateGroup } from '../gate-group/gate-group.entity';
// import { UserEditable } from '../utils/decorators/user.editable.decorator';
import { UserEmail } from '../user_email';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('text')
  @Exclude()
  password: string;

  @Column('text')
  // @UserEditable() TODO: create this decorator
  name: string;

  // TODO: Think about breaking addresses out into a one-to-one table
  @Column('text')
  // @UserEditable() TODO: create this decorator
  address: string;

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

  @Column({
    type: 'timestamptz',
    nullable: true,
    transformer: new TimestampTzTransformer(),
  })
  @Transform(DateTimeToString)
  verification_address_sent_at: DateTime;

  @Column('text', { nullable: true })
  @Exclude()
  verification_address_pin: string;

  @Column({ default: false })
  verified_address: boolean;

  @OneToMany(type => UserToken, user_token => user_token.user)
  tokens: UserToken[];

  @ManyToMany(type => GateGroup)
  @JoinTable({
    name: 'user_join_gate_group',
    joinColumn: { name: 'user_uuid' },
    inverseJoinColumn: { name: 'gate_group_uuid' },
  })
  gate_groups: GateGroup[];
  /** One User to Many UserAddress */ @OneToMany(
    () => UserEmail,
    (user_email: UserEmail) => user_email.user,
  )
  user_emails: UserEmail[];

}
