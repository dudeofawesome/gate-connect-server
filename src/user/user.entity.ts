import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

import {
  TimestampTzTransformer,
  DateTimeToString,
} from '../utils/transformers/';
import { UserToken } from '../user-token/user-token.entity';
import { UserAddress } from '../user_address/user_address.entity';
// import { UserEditable } from '../utils/decorators/user.editable.decorator';
import { UserEmail } from '../user_email/user_email.entity';

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

  /** One User to Many UserAddress */
  @OneToMany(
    () => UserAddress,
    (user_address: UserAddress) => user_address.user,
  )
  addresses: UserAddress[];

  /** One User to Many UserAddress */
  @OneToMany(() => UserEmail, (user_email: UserEmail) => user_email.user)
  emails: UserEmail[];

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
