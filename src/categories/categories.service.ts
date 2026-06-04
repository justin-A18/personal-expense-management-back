import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { GetAllCategoriesDto } from './dto/get-all-categories.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Wallet)
    private readonly walletsRepository: Repository<Wallet>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const { walletId, ...categoryData } = createCategoryDto;
    const wallet = await this.findWallet(walletId, userId);
    const findCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name, wallet: { id: wallet.id } },
    });

    if (findCategory) {
      throw new BadRequestException('La categoría ya existe');
    }

    const category = this.categoriesRepository.create({
      ...categoryData,
      wallet,
    });
    await this.categoriesRepository.save(category);

    return {
      message: 'Categoria creada exitosamente',
      data: category,
    };
  }

  async findAll(findAllCategoriesDto: GetAllCategoriesDto, userId: string) {
    const { walletId, type, name, limit, offset } = findAllCategoriesDto;

    await this.findWallet(walletId, userId);

    const queryBuilder =
      this.categoriesRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.wallet', 'wallet')
        .where('wallet.id = :walletId', { walletId });

    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }
    if (name) {
      queryBuilder.andWhere('category.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }

    const [categories, totalElements] = await queryBuilder.getManyAndCount();

    const totalPages =
      limit !== undefined
        ? Math.ceil(totalElements / limit)
        : Number(totalElements > 0);

    return {
      message: 'Categorías obtenidas exitosamente',
      data: {
        content: categories,
        totalElements,
        totalPages,
      },
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    const findCategory = await this.findCategoryForUser(id, userId);
    const { walletId, ...categoryData } = updateCategoryDto;
    const targetWallet = walletId
      ? await this.findWallet(walletId, userId)
      : findCategory.wallet;

    if (categoryData.name) {
      const duplicateCategory = await this.categoriesRepository.findOne({
        where: {
          name: categoryData.name,
          wallet: { id: targetWallet.id },
        },
      });

      if (duplicateCategory && duplicateCategory.id !== id) {
        throw new BadRequestException('La categoría ya existe');
      }
    }

    Object.assign(findCategory, categoryData, { wallet: targetWallet });

    const updatedCategory = await this.categoriesRepository.save(findCategory);

    return {
      message: 'Categoría actualizada exitosamente',
      data: updatedCategory,
    };
  }

  async remove(id: string, userId: string) {
    const findCategory = await this.findCategoryForUser(id, userId);

    await this.categoriesRepository.remove(findCategory);

    return {
      message: 'Categoría eliminada exitosamente',
      data: findCategory,
    };
  }

  private async findWallet(id: string, userId: string) {
    const wallet = await this.walletsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!wallet) {
      throw new NotFoundException(
        `La billetera con ID ${id} no fue encontrada`,
      );
    }

    return wallet;
  }

  private async findCategoryForUser(id: string, userId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id, wallet: { user: { id: userId } } },
      relations: ['wallet'],
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }
}
