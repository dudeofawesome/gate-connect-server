import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar(???)')
  authorization_token: string;

  // ManyToOne: user_id
}
