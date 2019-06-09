import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Generated,
  Index,
} from 'typeorm';
import { UserToken } from '../user-token/user-token.entity';
import { GateGroup } from '../gate-group/gate-group.entity';

import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @Index({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column('text', { unique: true })
  @IsEmail()
  email: string;

  @Column('text')
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  address: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column('timestamptz', { nullable: true })
  verification_email_sent_at: Date;

  @Column('timestamptz', { nullable: true })
  verification_address_sent_at: Date;

  @Column('text', { nullable: true })
  @Exclude()
  verification_email_token: string;

  @Column('text', { nullable: true })
  @Exclude()
  verification_address_pin: string;

  @Column({ default: false })
  verified_email: boolean;

  @Column({ default: false })
  verified_address: boolean;

  @OneToMany(type => UserToken, user_token => user_token.user)
  tokens: UserToken[];

  @ManyToMany(type => GateGroup)
  @JoinTable()
  join: GateGroup[];
}
