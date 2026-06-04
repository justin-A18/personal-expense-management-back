import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptAdapter } from 'src/config/adapters/security';
import { CurrencyEnum } from 'src/config/enums/currency.enum';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { Category } from 'src/categories/entities/category.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Repository } from 'typeorm';

const seedUsers = [
  {
    username: 'Justin Demo',
    email: 'justin.demo@example.com',
    password: 'password123',
  },
  {
    username: 'Maria Demo',
    email: 'maria.demo@example.com',
    password: 'password123',
  },
];

const seedCategories = [
  {
    walletName: 'Cuenta principal',
    userEmail: 'justin.demo@example.com',
    name: 'Alimentación',
    description: 'Supermercado, restaurantes y compras de comida.',
    icon: 'utensils',
    type: TYPE_TRANSACTION.EXPENSE,
  },
  {
    walletName: 'Cuenta principal',
    userEmail: 'justin.demo@example.com',
    name: 'Transporte',
    description: 'Taxi, buses, combustible y movilidad diaria.',
    icon: 'car',
    type: TYPE_TRANSACTION.EXPENSE,
  },
  {
    walletName: 'Cuenta principal',
    userEmail: 'justin.demo@example.com',
    name: 'Servicios',
    description: 'Luz, agua, internet, teléfono y suscripciones.',
    icon: 'receipt',
    type: TYPE_TRANSACTION.EXPENSE,
  },
  {
    walletName: 'Cuenta principal',
    userEmail: 'justin.demo@example.com',
    name: 'Entretenimiento',
    description: 'Cine, salidas, juegos y ocio.',
    icon: 'party-popper',
    type: TYPE_TRANSACTION.EXPENSE,
  },
  {
    walletName: 'Billetera diaria',
    userEmail: 'maria.demo@example.com',
    name: 'Salud',
    description: 'Consultas, medicinas y seguros médicos.',
    icon: 'heart-pulse',
    type: TYPE_TRANSACTION.EXPENSE,
  },
  {
    walletName: 'Cuenta principal',
    userEmail: 'justin.demo@example.com',
    name: 'Sueldo',
    description: 'Ingreso fijo por trabajo principal.',
    icon: 'briefcase',
    type: TYPE_TRANSACTION.INCOME,
  },
  {
    walletName: 'Ahorros USD',
    userEmail: 'justin.demo@example.com',
    name: 'Freelance',
    description: 'Ingresos por trabajos independientes.',
    icon: 'laptop',
    type: TYPE_TRANSACTION.INCOME,
  },
  {
    walletName: 'Billetera diaria',
    userEmail: 'maria.demo@example.com',
    name: 'Sueldo',
    description: 'Ingreso fijo por trabajo principal.',
    icon: 'briefcase',
    type: TYPE_TRANSACTION.INCOME,
  },
  {
    walletName: 'Billetera diaria',
    userEmail: 'maria.demo@example.com',
    name: 'Servicios',
    description: 'Luz, agua, internet, teléfono y suscripciones.',
    icon: 'receipt',
    type: TYPE_TRANSACTION.EXPENSE,
  },
];

const seedWallets = [
  {
    userEmail: 'justin.demo@example.com',
    name: 'Cuenta principal',
    avatar: 'wallet-primary',
    currency: CurrencyEnum.PEN,
  },
  {
    userEmail: 'justin.demo@example.com',
    name: 'Ahorros USD',
    avatar: 'wallet-savings',
    currency: CurrencyEnum.USD,
  },
  {
    userEmail: 'maria.demo@example.com',
    name: 'Billetera diaria',
    avatar: 'wallet-daily',
    currency: CurrencyEnum.PEN,
  },
];

const seedTransactions = [
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo noviembre',
    amount: '3300.00',
    date: '2025-11-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Supermercado demo noviembre',
    amount: '420.00',
    date: '2025-11-06',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Transporte',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Movilidad demo noviembre',
    amount: '130.00',
    date: '2025-11-11',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo diciembre',
    amount: '3300.00',
    date: '2025-12-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Supermercado demo diciembre',
    amount: '455.00',
    date: '2025-12-07',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Entretenimiento',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Salidas demo diciembre',
    amount: '210.00',
    date: '2025-12-18',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo enero',
    amount: '3400.00',
    date: '2026-01-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Supermercado demo enero',
    amount: '470.00',
    date: '2026-01-06',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Servicios',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Servicios demo enero',
    amount: '260.00',
    date: '2026-01-15',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo febrero',
    amount: '3400.00',
    date: '2026-02-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Supermercado demo febrero',
    amount: '520.00',
    date: '2026-02-07',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Transporte',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Movilidad demo febrero',
    amount: '155.00',
    date: '2026-02-10',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Ahorros USD',
    categoryName: 'Freelance',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Proyecto freelance demo febrero',
    amount: '300.00',
    date: '2026-02-12',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo marzo',
    amount: '3400.00',
    date: '2026-03-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Supermercado demo marzo',
    amount: '610.00',
    date: '2026-03-08',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Entretenimiento',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Concierto demo marzo',
    amount: '320.00',
    date: '2026-03-20',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Ahorros USD',
    categoryName: 'Freelance',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Proyecto freelance demo marzo',
    amount: '380.00',
    date: '2026-03-18',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo abril',
    amount: '3500.00',
    date: '2026-04-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Supermercado demo abril',
    amount: '700.00',
    date: '2026-04-06',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Servicios',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Servicios demo abril',
    amount: '290.00',
    date: '2026-04-15',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Sueldo mensual demo',
    amount: '3500.00',
    date: '2026-05-01',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Alimentación',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Compra de supermercado demo',
    amount: '185.40',
    date: '2026-05-03',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Cuenta principal',
    categoryName: 'Transporte',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Taxi al trabajo demo',
    amount: '28.50',
    date: '2026-05-04',
  },
  {
    userEmail: 'justin.demo@example.com',
    walletName: 'Ahorros USD',
    categoryName: 'Freelance',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Proyecto freelance demo',
    amount: '450.00',
    date: '2026-05-08',
  },
  {
    userEmail: 'maria.demo@example.com',
    walletName: 'Billetera diaria',
    categoryName: 'Sueldo',
    type: TYPE_TRANSACTION.INCOME,
    description: 'Pago quincenal demo',
    amount: '1800.00',
    date: '2026-05-15',
  },
  {
    userEmail: 'maria.demo@example.com',
    walletName: 'Billetera diaria',
    categoryName: 'Servicios',
    type: TYPE_TRANSACTION.EXPENSE,
    description: 'Pago de internet demo',
    amount: '99.90',
    date: '2026-05-16',
  },
];

@Injectable()
export class SeedService {
  private readonly bcryptAdapter = new BcryptAdapter();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async run() {
    const users = await this.seedUsers();
    const wallets = await this.seedWallets(users.byEmail);
    const categories = await this.seedCategories(wallets.byUserEmailAndName);
    const transactions = await this.seedTransactions(
      users.byEmail,
      categories.byWalletAndName,
      wallets.byUserEmailAndName,
    );

    return {
      message: 'Seed ejecutado correctamente',
      data: {
        users: users.summary,
        categories: categories.summary,
        wallets: wallets.summary,
        transactions,
      },
    };
  }

  private async seedUsers() {
    const byEmail = new Map<string, User>();
    let created = 0;
    let existing = 0;
    let updated = 0;

    for (const seedUser of seedUsers) {
      let user = await this.userRepository.findOne({
        where: { email: seedUser.email },
      });

      if (user) {
        existing++;
      } else {
        user = this.userRepository.create({
          username: seedUser.username,
          email: seedUser.email,
          password: this.bcryptAdapter.hash(seedUser.password),
          isEmailVerified: true,
        });
        user = await this.userRepository.save(user);
        created++;
      }

      byEmail.set(seedUser.email, user);
    }

    return { byEmail, summary: { created, existing } };
  }

  private async seedCategories(walletsByUserEmailAndName: Map<string, Wallet>) {
    const byWalletAndName = new Map<string, Category>();
    let created = 0;
    let existing = 0;
    let updated = 0;

    for (const seedCategory of seedCategories) {
      const wallet = walletsByUserEmailAndName.get(
        this.walletKey(seedCategory.userEmail, seedCategory.walletName),
      );

      if (!wallet) {
        throw new Error(`Seed wallet not found: ${seedCategory.walletName}`);
      }

      let category = await this.categoryRepository.findOne({
        where: { name: seedCategory.name, wallet: { id: wallet.id } },
      });

      if (category) {
        existing++;

        if (!category.type || !category.wallet) {
          category.type = seedCategory.type;
          category.wallet = wallet;
          category = await this.categoryRepository.save(category);
          updated++;
        }
      } else {
        const { userEmail, walletName, ...categoryData } = seedCategory;
        category = this.categoryRepository.create({
          ...categoryData,
          wallet,
        });
        category = await this.categoryRepository.save(category);
        created++;
      }

      byWalletAndName.set(
        this.categoryKey(wallet.id, seedCategory.name),
        category,
      );
    }

    return { byWalletAndName, summary: { created, existing, updated } };
  }

  private async seedWallets(usersByEmail: Map<string, User>) {
    const byUserEmailAndName = new Map<string, Wallet>();
    let created = 0;
    let existing = 0;

    for (const seedWallet of seedWallets) {
      const user = usersByEmail.get(seedWallet.userEmail);

      if (!user) {
        throw new Error(`Seed user not found: ${seedWallet.userEmail}`);
      }

      let wallet = await this.walletRepository.findOne({
        where: {
          name: seedWallet.name,
          user: { id: user.id },
        },
      });

      if (wallet) {
        existing++;
      } else {
        wallet = this.walletRepository.create({
          name: seedWallet.name,
          avatar: seedWallet.avatar,
          balance: '0.00',
          currency: seedWallet.currency,
          user,
        });
        wallet = await this.walletRepository.save(wallet);
        created++;
      }

      byUserEmailAndName.set(
        this.walletKey(seedWallet.userEmail, seedWallet.name),
        wallet,
      );
    }

    return { byUserEmailAndName, summary: { created, existing } };
  }

  private async seedTransactions(
    usersByEmail: Map<string, User>,
    categoriesByWalletAndName: Map<string, Category>,
    walletsByUserEmailAndName: Map<string, Wallet>,
  ) {
    let created = 0;
    let existing = 0;
    let updated = 0;

    for (const seedTransaction of seedTransactions) {
      const user = usersByEmail.get(seedTransaction.userEmail);
      const wallet = walletsByUserEmailAndName.get(
        this.walletKey(seedTransaction.userEmail, seedTransaction.walletName),
      );

      if (!user) {
        throw new Error(`Seed user not found: ${seedTransaction.userEmail}`);
      }

      if (!wallet) {
        throw new Error(
          `Seed wallet not found: ${seedTransaction.walletName}`,
        );
      }

      const category = categoriesByWalletAndName.get(
        this.categoryKey(wallet.id, seedTransaction.categoryName),
      );

      if (!category) {
        throw new Error(
          `Seed category not found: ${seedTransaction.categoryName}`,
        );
      }

      const existingTransaction = await this.transactionRepository.findOne({
        where: {
          description: seedTransaction.description,
          date: new Date(seedTransaction.date),
          wallet: { id: wallet.id, user: { id: user.id } },
        },
        relations: ['category'],
      });

      if (existingTransaction) {
        if (existingTransaction.category?.id !== category.id) {
          existingTransaction.category = category;
          await this.transactionRepository.save(existingTransaction);
          updated++;
        }

        existing++;
        continue;
      }

      const transaction = this.transactionRepository.create({
        type: seedTransaction.type,
        description: seedTransaction.description,
        amount: seedTransaction.amount,
        date: new Date(seedTransaction.date),
        wallet,
        category,
      });

      await this.transactionRepository.save(transaction);
      wallet.balance = this.applyTransactionToBalance(
        wallet.balance,
        seedTransaction.type,
        seedTransaction.amount,
      );
      await this.walletRepository.save(wallet);
      created++;
    }

    return { created, existing, updated };
  }

  private walletKey(userEmail: string, walletName: string) {
    return `${userEmail}:${walletName}`;
  }

  private categoryKey(walletId: string, categoryName: string) {
    return `${walletId}:${categoryName}`;
  }

  private applyTransactionToBalance(
    currentBalance: string,
    type: TYPE_TRANSACTION,
    amount: string,
  ) {
    const currentBalanceInCents = this.toCents(currentBalance);
    const amountInCents = this.toCents(amount);
    const signedAmount =
      type === TYPE_TRANSACTION.INCOME ? amountInCents : -amountInCents;

    return this.formatCents(currentBalanceInCents + signedAmount);
  }

  private toCents(value: string) {
    return Math.round(Number(value) * 100);
  }

  private formatCents(value: number) {
    return (value / 100).toFixed(2);
  }
}
