import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { FindAllTransactionDto } from './dto/find-all-transaction.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private TransactionsRepository: Repository<Transaction>,
    private readonly walletsService: WalletsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { data: wallet } = await this.walletsService.findOne(
      createTransactionDto.walletId,
    );

    const amount = parseFloat(createTransactionDto.amount);
    let newBalance = parseFloat(wallet.balance);

    if (createTransactionDto.type === TYPE_TRANSACTION.INCOME) {
      newBalance += amount;
    } else if (createTransactionDto.type === TYPE_TRANSACTION.EXPENSE) {
      if (newBalance < amount) {
        throw new NotFoundException('No tienes suficiente dinero');
      }
      newBalance -= amount;
    }

    const transaction = this.TransactionsRepository.create({
      ...createTransactionDto,
      wallet: { id: createTransactionDto.walletId },
    });

    await this.TransactionsRepository.save(transaction);

    wallet.balance = newBalance.toFixed(2);
    await this.walletsService.update(wallet.id, { balance: wallet.balance });

    return {
      message: 'Transacción creada correctamente',
      data: transaction,
    };
  }

  async findAll(
    findAllTransactionDto: FindAllTransactionDto,
    params: PaginationDto,
  ) {
    const { walletId, category, type, date, orderBy } = findAllTransactionDto;
    const { limit = 10, offset = 0 } = params;

    await this.walletsService.findOne(walletId);

    const queryBuilder = this.TransactionsRepository.createQueryBuilder(
      'transaction',
    )
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .where('transaction.wallet = :walletId', { walletId });

    if (category) {
      queryBuilder.andWhere('transaction.category = :category', { category });
    }

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (date) {
      queryBuilder.andWhere('transaction.date = :date', { date });
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

  async findOne(id: string) {
    const transaction = await this.TransactionsRepository.findOne({
      where: { id },
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

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    await this.walletsService.findOne(updateTransactionDto.walletId);

    const transaction = await this.TransactionsRepository.preload({
      id,
      ...updateTransactionDto,
    });

    if (!transaction) {
      throw new NotFoundException(
        `La transaccion con ID ${id} no fue encontrado`,
      );
    }

    await this.TransactionsRepository.save(transaction);

    return {
      message: 'Transaccion actualizada correctamente',
      data: transaction,
    };
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    await this.TransactionsRepository.remove(transaction.data);
    return {
      message: 'Transaccion eliminada correctamente',
      data: transaction.data,
    };
  }
}
