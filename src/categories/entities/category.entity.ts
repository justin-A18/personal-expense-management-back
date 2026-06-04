import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 500 })
  description: string;

  @Column('varchar', { length: 50 })
  icon: string;

  @Column({
    type: 'enum',
    enum: TYPE_TRANSACTION,
  })
  type: TYPE_TRANSACTION;

  @ManyToOne(() => Wallet, (wallet) => wallet.categories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  wallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
