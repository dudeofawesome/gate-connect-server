import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GateGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  @Column('varchar(50)')
  hoa_phone: string;

  @Column('text')
  hoa_email: string;

  @Column('text')
  hoa_address: string;
}
