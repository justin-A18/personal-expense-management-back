import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto, userId: string) {
    const newWallet = this.walletRepository.create({
      ...createWalletDto,
      user: { id: userId },
    });
    await this.walletRepository.save(newWallet);

    return {
      message: 'Billetera creada correctamente',
      data: newWallet,
    };
  }

  async findAll(paginationDto: PaginationDto, userId: string) {
    const { limit = 10, offset = 0 } = paginationDto;

    const wallets = await this.walletRepository.find({
      where: { user: { id: userId } },
      take: limit,
      skip: offset,
      relations: ['user'],
      select: {
        id: true,
        name: true,
        balance: true,
        user: {
          id: true,
          username: true,
          email: true,
        },
      },
    });

    return {
      message: 'Se obtuvieron las billeteras correctamente',
      data: wallets,
    };
  }

  async findOne(id: string, userId: string) {
    const wallet = await this.walletRepository.findOneBy({
      id,
      user: { id: userId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `La billetera con ID ${id} no fue encontrado`,
      );
    }

    return {
      message: 'Billetera obtenida correctamente',
      data: wallet,
    };
  }

  async update(id: string, updateWalletDto: UpdateWalletDto, userId: string) {
    const wallet = await this.walletRepository.preload({
      ...updateWalletDto,
      id,
      user: { id: userId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `La billetera con ID ${id} no fue encontrado`,
      );
    }

    await this.walletRepository.save(wallet);

    return {
      message: 'Billetera actualizada correctamente',
      data: wallet,
    };
  }

  async remove(id: string, userId: string) {
    const wallet = await this.findOne(id, userId);
    await this.walletRepository.remove(wallet.data);

    return {
      message: 'Billetera eliminada correctamente',
      data: wallet.data,
    };
  }
}
