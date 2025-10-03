import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from 'src/wallets/wallets.module';
import { AuthModule } from 'src/auth/auth.module';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Wallet]),
    WalletsModule,
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
