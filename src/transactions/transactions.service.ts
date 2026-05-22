import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { FindAllTransactionDto } from './dto/find-all-transaction.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private TransactionsRepository: Repository<Transaction>,
    private readonly walletsService: WalletsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const transaction = await this.dataSource.transaction(async (manager) => {
      const transactionRepository = manager.getRepository(Transaction);
      const walletRepository = manager.getRepository(Wallet);
      const wallet = await this.findWalletForUpdate(
        createTransactionDto.walletId,
        userId,
        walletRepository,
      );

      wallet.balance = this.calculateBalance(wallet.balance, [
        { transaction: createTransactionDto, operation: 'apply' },
      ]);

      const newTransaction = transactionRepository.create({
        ...createTransactionDto,
        wallet,
      });

      await walletRepository.save(wallet);
      return transactionRepository.save(newTransaction);
    });

    return {
      message: 'Transacción creada correctamente',
      data: transaction,
    };
  }

  async findAll(
    findAllTransactionDto: FindAllTransactionDto,
    params: PaginationDto,
    userId: string,
  ) {
    const { walletId, type, from, to, orderBy } = findAllTransactionDto;
    const { limit = 10, offset = 0 } = params;

    await this.walletsService.findOne(walletId, userId);

    const queryBuilder = this.TransactionsRepository.createQueryBuilder(
      'transaction',
    )
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .where('wallet.id = :walletId', { walletId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (from && to) {
      queryBuilder.andWhere('transaction.date BETWEEN :from AND :to', {
        from,
        to,
      });
    } else if (from) {
      queryBuilder.andWhere('transaction.date >= :from', { from });
    } else if (to) {
      queryBuilder.andWhere('transaction.date <= :to', { to });
    }

    if (orderBy) {
      queryBuilder.orderBy('transaction.date', orderBy);
    }

    queryBuilder.limit(limit);
    queryBuilder.offset(offset);

    const [transactions, totalElements] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalElements / limit);

    return {
      message: 'Se obtuvieron las transacciones correctamente',
      data: {
        content: transactions,
        totalElements,
        totalPages,
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const transaction = await this.TransactionsRepository.findOne({
      where: {
        id,
        ...(userId ? { wallet: { user: { id: userId } } } : {}),
      },
      relations: ['wallet'],
    });

    if (!transaction) {
      throw new NotFoundException(
        `La transaccion con ID ${id} no fue encontrado`,
      );
    }

    return {
      message: 'Transaccion obtenida correctamente',
      data: transaction,
    };
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    const transaction = await this.dataSource.transaction(async (manager) => {
      const transactionRepository = manager.getRepository(Transaction);
      const walletRepository = manager.getRepository(Wallet);
      const currentTransaction = await transactionRepository.findOne({
        where: {
          id,
          wallet: { user: { id: userId } },
        },
        relations: ['wallet'],
      });

      if (!currentTransaction) {
        throw new NotFoundException(
          `La transaccion con ID ${id} no fue encontrado`,
        );
      }

      const { walletId, ...transactionChanges } = updateTransactionDto;
      const originalWallet = await this.findWalletForUpdate(
        currentTransaction.wallet.id,
        userId,
        walletRepository,
      );
      const targetWallet =
        walletId && walletId !== originalWallet.id
          ? await this.findWalletForUpdate(walletId, userId, walletRepository)
          : originalWallet;

      originalWallet.balance = this.calculateBalance(originalWallet.balance, [
        { transaction: currentTransaction, operation: 'revert' },
      ]);

      Object.assign(currentTransaction, transactionChanges, {
        wallet: targetWallet,
      });

      targetWallet.balance = this.calculateBalance(targetWallet.balance, [
        { transaction: currentTransaction, operation: 'apply' },
      ]);

      if (targetWallet.id !== originalWallet.id) {
        await walletRepository.save(originalWallet);
      }

      await walletRepository.save(targetWallet);
      return transactionRepository.save(currentTransaction);
    });

    return {
      message: 'Transaccion actualizada correctamente',
      data: transaction,
    };
  }

  async remove(id: string, userId: string) {
    const transaction = await this.dataSource.transaction(async (manager) => {
      const transactionRepository = manager.getRepository(Transaction);
      const walletRepository = manager.getRepository(Wallet);
      const currentTransaction = await transactionRepository.findOne({
        where: {
          id,
          wallet: { user: { id: userId } },
        },
        relations: ['wallet'],
      });

      if (!currentTransaction) {
        throw new NotFoundException(
          `La transaccion con ID ${id} no fue encontrado`,
        );
      }

      const wallet = await this.findWalletForUpdate(
        currentTransaction.wallet.id,
        userId,
        walletRepository,
      );

      wallet.balance = this.calculateBalance(wallet.balance, [
        { transaction: currentTransaction, operation: 'revert' },
      ]);

      await walletRepository.save(wallet);
      await transactionRepository.remove(currentTransaction);

      return currentTransaction;
    });

    return {
      message: 'Transaccion eliminada correctamente',
      data: transaction,
    };
  }

  private async findWalletForUpdate(
    id: string,
    userId: string,
    walletRepository: Repository<Wallet>,
  ) {
    const wallet = await walletRepository.findOne({
      where: { id, user: { id: userId } },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException(
        `La billetera con ID ${id} no fue encontrado`,
      );
    }

    return wallet;
  }

  private calculateBalance(
    currentBalance: string,
    operations: {
      transaction: Pick<Transaction | CreateTransactionDto, 'type' | 'amount'>;
      operation: 'apply' | 'revert';
    }[],
  ) {
    const newBalance = operations.reduce((balance, item) => {
      const signedAmount = this.getSignedAmountInCents(item.transaction);
      return item.operation === 'apply'
        ? balance + signedAmount
        : balance - signedAmount;
    }, this.toCents(currentBalance));

    if (newBalance < 0) {
      throw new BadRequestException('No tienes suficiente dinero');
    }

    return this.formatCents(newBalance);
  }

  private getSignedAmountInCents(
    transaction: Pick<Transaction | CreateTransactionDto, 'type' | 'amount'>,
  ) {
    const amount = this.toCents(transaction.amount);

    return transaction.type === TYPE_TRANSACTION.INCOME ? amount : -amount;
  }

  private toCents(value: string) {
    return Math.round(Number(value) * 100);
  }

  private formatCents(value: number) {
    return (value / 100).toFixed(2);
  }
}
