import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  Generated,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import {} from '@nestjs/swagger';

import { User } from '../user/user.entity';
import { JwtPayload } from '../auth/';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  // TODO: make this be the relationship
  @Column('text')
  @Index()
  /** Token's subject (user's UUID) */
  token_payload_sub: string;

  @Column('timestamptz')
  @Index()
  /** Token's issued at date */
  token_payload_iat: Date;

  @Column({ default: false })
  blacklisted: boolean;

  @ManyToOne(type => User, user => user.tokens, {
    cascade: true,
    nullable: false,
  })
  user: User;
}
