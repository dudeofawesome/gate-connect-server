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
export class Gate {
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

  @Column('point')
  location: string;
}
