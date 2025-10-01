import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  username: string;

  @Column('varchar', { length: 300, unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @OneToMany(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallets: Wallet[];
}
