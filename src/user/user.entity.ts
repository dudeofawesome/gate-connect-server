import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
  Index,
} from 'typeorm';
import { UserToken } from '../user-token/user-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
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
  verification_email_token: string;

  @Column('text', { nullable: true })
  verification_address_pin: string;

  @Column({ default: false })
  verified_email: boolean;

  @Column({ default: false })
  verified_address: boolean;

  @OneToMany(type => UserToken, (user_token: UserToken) => user_token.user)
  tokens: UserToken[];
}
