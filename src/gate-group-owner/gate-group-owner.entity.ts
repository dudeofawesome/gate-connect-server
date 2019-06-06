import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  Index,
} from 'typeorm';

@Entity()
export class GateGroupOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  @Generated('uuid')
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column('text')
  description: string;

  @Column('text')
  name: string;

  @Column('text')
  phone: string;

  @Column('text')
  email: string;

  @Column('text')
  address: string;
}
