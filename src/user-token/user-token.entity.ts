import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar(???)')
  authorization_token: string;

  // ManyToOne: user_id
}
