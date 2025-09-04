import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { TxType } from './enums';

@Entity('transactions')
@Index(['userId', 'occurredAt'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (u) => u.transactions, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'enum', enum: TxType })
  type!: TxType;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount!: string; // usar string para valores DECIMAL

  @Column({ type: 'varchar', length: 120 })
  category!: string;

  @Column({ type: 'text', array: true, default: '{}' })
  tags!: string[];

  @Column({ type: 'timestamptz' })
  occurredAt!: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
