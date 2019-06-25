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
import { UserAddress } from '../user_address';
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

  /** One User to Many UserToken */
  @OneToMany(() => UserToken, user_token => user_token.user)
  tokens: UserToken[];

  /** Many User to Many GateGroup */
  @ManyToMany(() => GateGroup)
  @JoinTable({
    name: 'user_join_gate_group',
    joinColumn: { name: 'user_uuid' },
    inverseJoinColumn: { name: 'gate_group_uuid' },
  })
  gate_groups: GateGroup[];

  /** One User to Many UserAddress */
  @OneToMany(
    () => UserAddress,
    (user_address: UserAddress) => user_address.user,
  )
  user_addresses: UserAddress[];

  /** One User to Many UserAddress */
  @OneToMany(() => UserEmail, (user_email: UserEmail) => user_email.user)
  user_emails: UserEmail[];

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
