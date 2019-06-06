import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  Generated,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column('text')
  @Index({ unique: true })
  authorization_token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'interval', default: '1337 seconds' })
  ttl: number;

  @ManyToOne(type => User, (user: User) => user.tokens, { cascade: true })
  user: User;
}
