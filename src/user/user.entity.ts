import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
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

  @Column('timestamptz', {
    nullable: true,
  })
  verification_email_sent_at: Date;

  @Column('timestamptz', {
    nullable: true,
  })
  verification_address_sent_at: Date;

  @Column('text', {
    nullable: true,
  })
  verification_email_token: string;

  @Column('text', {
    nullable: true,
  })
  verification_address_pin: string;

  @Column({ default: false })
  verified_email: boolean;

  @Column({ default: false })
  verified_address: boolean;
}
