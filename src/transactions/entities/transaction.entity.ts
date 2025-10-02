import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TYPE_TRANSACTION,
  })
  type: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  amount: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  wallet: Wallet;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
