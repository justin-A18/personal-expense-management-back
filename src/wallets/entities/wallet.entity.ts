import { CurrencyEnum } from 'src/config/enums/currency.enum';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('text')
  avatar: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column({
    type: 'enum',
    enum: CurrencyEnum,
  })
  currency: string;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];
}
