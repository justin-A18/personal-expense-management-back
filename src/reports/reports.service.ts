import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { WalletsService } from 'src/wallets/wallets.service';
import { Repository } from 'typeorm';
import { ReportDto } from './dto/report.dto';
import {
  ReportMonthTransaction,
  ReportRow,
} from './interfaces/report-transaction.interface';
import { ReportByTypeDto } from './dto/report-by-type.dto';
import {
  TrendsComparisonMode,
  TrendsReportDto,
} from './dto/trends-report.dto';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

interface TrendMetric {
  current: number;
  baseline: number;
  changePercent: number | null;
}

interface TrendCategoryTotal {
  categoryId: string;
  categoryName: string;
  type: TYPE_TRANSACTION;
  amount: number;
}

interface TrendInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private TransactionsRepository: Repository<Transaction>,
    private readonly walletsService: WalletsService,
  ) {}

  async findTrends(trendsReportDto: TrendsReportDto, userId: string) {
    const { walletId, from, to, comparisonMode } = trendsReportDto;

    await this.walletsService.findOne(walletId, userId);
    this.validateDateRange(from, to);

    const comparison = this.resolveComparisonPeriod(from, to, comparisonMode);
    const baselineDivisor =
      comparisonMode === TrendsComparisonMode.LAST_3_MONTHS
        ? 3
        : comparisonMode === TrendsComparisonMode.LAST_6_MONTHS
          ? 6
          : 1;

    const [currentSummary, baselineSummary, currentExpenses, baselineExpenses] =
      await Promise.all([
        this.getSummary(walletId, from, to),
        this.getSummary(
          walletId,
          comparison.from,
          comparison.to,
          baselineDivisor,
        ),
        this.getCategoryTotals(walletId, from, to, TYPE_TRANSACTION.EXPENSE),
        this.getCategoryTotals(
          walletId,
          comparison.from,
          comparison.to,
          TYPE_TRANSACTION.EXPENSE,
          baselineDivisor,
        ),
      ]);

    const summary = {
      income: this.toTrendMetric(currentSummary.income, baselineSummary.income),
      expense: this.toTrendMetric(
        currentSummary.expense,
        baselineSummary.expense,
      ),
      balance: this.toTrendMetric(
        currentSummary.income - currentSummary.expense,
        baselineSummary.income - baselineSummary.expense,
      ),
    };

    const topGrowingCategories = this.getTopGrowingCategories(
      currentExpenses,
      baselineExpenses,
    );
    const spendingDistribution =
      this.getSpendingDistribution(currentExpenses);
    const temporalPattern = await this.getTemporalPattern(walletId, from, to);
    const insights = this.getInsights(
      summary,
      topGrowingCategories,
      currentSummary.income + currentSummary.expense,
      baselineSummary.income + baselineSummary.expense,
    );

    return {
      message: 'Se obtuvieron las tendencias correctamente',
      data: {
        comparisonMode,
        currentPeriod: { from, to },
        comparisonPeriod: comparison,
        summary,
        topGrowingCategories,
        spendingDistribution,
        temporalPattern,
        insights,
      },
    };
  }

  async findWeeklyReport(findWeeklyReportDto: ReportByTypeDto, userId: string) {
    const { from, to, walletId, type } = findWeeklyReportDto;

    await this.walletsService.findOne(walletId, userId);

    const rawReport = await this.TransactionsRepository.query<ReportRow[]>(
      `WITH dias AS (
        SELECT generate_series(
          $1::date,
          $2::date,
          interval '1 day'
        )::date AS dia
      )
      SELECT
        TO_CHAR(d.dia, 'TMDay') AS day,
        COALESCE(SUM(t.amount), 0) AS total
      FROM dias d
      LEFT JOIN "transactions" t
        ON DATE(t.date) = d.dia
        AND t."walletId" = $3
        AND t."type" = $4
      GROUP BY d.dia
      ORDER BY d.dia ASC;
      `,
      [from, to, walletId, type],
    );

    const results = rawReport.map((r) => ({
      day: r.day.trim(),
      total: parseFloat(r.total),
    }));

    return {
      message: 'Se obtuvo el reporte semanal correctamente',
      data: results,
    };
  }

  async findMonthlyReport(findMonthlyReportDto: ReportDto, userId: string) {
    const { from, to, walletId } = findMonthlyReportDto;

    await this.walletsService.findOne(walletId, userId);

    const rawReport = await this.TransactionsRepository.query<
      ReportMonthTransaction[]
    >(
      `WITH meses AS (
        SELECT generate_series(
          $1::date,
          $2::date,
          INTERVAL '1 month'
        )::date AS mes
      )
      SELECT 
        TO_CHAR(m.mes, 'TMMonth') AS month,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'Ingreso'), 0) AS total_income,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'Gasto'), 0) AS total_expense
      FROM meses m
      LEFT JOIN "transactions" t 
        ON DATE_TRUNC('month', t.date) = DATE_TRUNC('month', m.mes)
        AND t."walletId" = $3
      GROUP BY m.mes
      ORDER BY m.mes;`,
      [from, to, walletId],
    );

    return {
      message: 'Se obtuvo el reporte mensual correctamente',
      data: rawReport,
    };
  }

  private async getSummary(
    walletId: string,
    from: string,
    to: string,
    divisor = 1,
  ) {
    const rawSummary = await this.TransactionsRepository.createQueryBuilder(
      'transaction',
    )
      .select(
        `COALESCE(SUM(transaction.amount) FILTER (WHERE transaction.type = :incomeType), 0)`,
        'income',
      )
      .addSelect(
        `COALESCE(SUM(transaction.amount) FILTER (WHERE transaction.type = :expenseType), 0)`,
        'expense',
      )
      .where('transaction.walletId = :walletId', { walletId })
      .andWhere('transaction.date BETWEEN :from AND :to', { from, to })
      .setParameters({
        incomeType: TYPE_TRANSACTION.INCOME,
        expenseType: TYPE_TRANSACTION.EXPENSE,
      })
      .getRawOne<{ income: string; expense: string }>();

    return {
      income: this.roundMoney(Number(rawSummary?.income ?? 0) / divisor),
      expense: this.roundMoney(Number(rawSummary?.expense ?? 0) / divisor),
    };
  }

  private async getCategoryTotals(
    walletId: string,
    from: string,
    to: string,
    type: TYPE_TRANSACTION,
    divisor = 1,
  ): Promise<TrendCategoryTotal[]> {
    const rawCategories = await this.TransactionsRepository.createQueryBuilder(
      'transaction',
    )
      .innerJoin('transaction.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.type', 'type')
      .addSelect('COALESCE(SUM(transaction.amount), 0)', 'amount')
      .where('transaction.walletId = :walletId', { walletId })
      .andWhere('transaction.date BETWEEN :from AND :to', { from, to })
      .andWhere('transaction.type = :type', { type })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.type')
      .getRawMany<{
        categoryId: string;
        categoryName: string;
        type: TYPE_TRANSACTION;
        amount: string;
      }>();

    return rawCategories.map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      type: category.type,
      amount: this.roundMoney(Number(category.amount) / divisor),
    }));
  }

  private async getTemporalPattern(walletId: string, from: string, to: string) {
    const rawPattern = await this.TransactionsRepository.query<
      {
        label: string;
        income: string;
        expense: string;
      }[]
    >(
      `WITH dias AS (
        SELECT generate_series($1::date, $2::date, interval '1 day')::date AS dia
      )
      SELECT
        TO_CHAR(d.dia, 'YYYY-MM-DD') AS label,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = $4), 0) AS income,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = $5), 0) AS expense
      FROM dias d
      LEFT JOIN "transactions" t
        ON DATE(t.date) = d.dia
        AND t."walletId" = $3
      GROUP BY d.dia
      ORDER BY d.dia ASC;`,
      [from, to, walletId, TYPE_TRANSACTION.INCOME, TYPE_TRANSACTION.EXPENSE],
    );

    return rawPattern.map((point) => ({
      label: point.label,
      income: this.roundMoney(Number(point.income)),
      expense: this.roundMoney(Number(point.expense)),
    }));
  }

  private getTopGrowingCategories(
    currentCategories: TrendCategoryTotal[],
    baselineCategories: TrendCategoryTotal[],
  ) {
    const baselineByCategoryId = new Map(
      baselineCategories.map((category) => [category.categoryId, category]),
    );

    return currentCategories
      .map((category) => {
        const baselineAmount =
          baselineByCategoryId.get(category.categoryId)?.amount ?? 0;

        return {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          type: category.type,
          currentAmount: category.amount,
          baselineAmount,
          changePercent: this.getChangePercent(category.amount, baselineAmount),
        };
      })
      .sort((a, b) => {
        if (a.changePercent === null && b.changePercent === null) {
          return b.currentAmount - a.currentAmount;
        }

        if (a.changePercent === null) return 1;
        if (b.changePercent === null) return -1;

        return b.changePercent - a.changePercent;
      })
      .slice(0, 5);
  }

  private getSpendingDistribution(currentExpenses: TrendCategoryTotal[]) {
    const totalExpense = currentExpenses.reduce(
      (total, category) => total + category.amount,
      0,
    );

    return currentExpenses
      .map((category) => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        amount: category.amount,
        percentage:
          totalExpense > 0
            ? this.roundPercent((category.amount / totalExpense) * 100)
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  private getInsights(
    summary: {
      income: TrendMetric;
      expense: TrendMetric;
      balance: TrendMetric;
    },
    topGrowingCategories: {
      categoryName: string;
      changePercent: number | null;
    }[],
    currentTotal: number,
    baselineTotal: number,
  ) {
    const insights: TrendInsight[] = [];

    if (currentTotal === 0 || baselineTotal === 0) {
      insights.push({
        type: 'info',
        title: 'Datos insuficientes',
        description:
          'Hace falta más movimiento en el periodo actual o en la base de comparación para calcular tendencias completas.',
      });
    }

    if (
      summary.expense.changePercent !== null &&
      summary.expense.changePercent >= 20
    ) {
      insights.push({
        type: 'warning',
        title: 'Gasto acelerado',
        description: `Tus gastos aumentaron ${summary.expense.changePercent}% frente a la base de comparación.`,
      });
    }

    if (
      summary.balance.changePercent !== null &&
      summary.balance.changePercent <= -20
    ) {
      insights.push({
        type: 'danger',
        title: 'Balance en descenso',
        description: `Tu balance cayó ${Math.abs(summary.balance.changePercent)}% frente a la base de comparación.`,
      });
    }

    const highGrowthCategory = topGrowingCategories.find(
      (category) =>
        category.changePercent !== null && category.changePercent >= 30,
    );

    if (highGrowthCategory) {
      insights.push({
        type: 'warning',
        title: 'Categoría con crecimiento alto',
        description: `${highGrowthCategory.categoryName} creció ${highGrowthCategory.changePercent}% frente a la base de comparación.`,
      });
    }

    if (
      summary.income.changePercent !== null &&
      summary.income.changePercent >= 10
    ) {
      insights.push({
        type: 'success',
        title: 'Ingresos en crecimiento',
        description: `Tus ingresos aumentaron ${summary.income.changePercent}% frente a la base de comparación.`,
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Sin cambios relevantes',
        description:
          'No se detectaron variaciones fuertes en tus ingresos, gastos o balance para este periodo.',
      });
    }

    return insights;
  }

  private resolveComparisonPeriod(
    from: string,
    to: string,
    comparisonMode: TrendsComparisonMode,
  ) {
    if (comparisonMode === TrendsComparisonMode.PREVIOUS_PERIOD) {
      const currentFrom = this.parseDate(from);
      const currentTo = this.parseDate(to);
      const durationInDays = this.diffInDays(currentFrom, currentTo) + 1;
      const comparisonTo = this.addDays(currentFrom, -1);
      const comparisonFrom = this.addDays(comparisonTo, -(durationInDays - 1));

      return {
        from: this.formatDate(comparisonFrom),
        to: this.formatDate(comparisonTo),
      };
    }

    const months =
      comparisonMode === TrendsComparisonMode.LAST_3_MONTHS ? 3 : 6;
    const currentFrom = this.parseDate(from);
    const currentMonthStart = new Date(
      Date.UTC(currentFrom.getUTCFullYear(), currentFrom.getUTCMonth(), 1),
    );
    const comparisonFrom = new Date(
      Date.UTC(
        currentMonthStart.getUTCFullYear(),
        currentMonthStart.getUTCMonth() - months,
        1,
      ),
    );
    const comparisonTo = this.addDays(currentMonthStart, -1);

    return {
      from: this.formatDate(comparisonFrom),
      to: this.formatDate(comparisonTo),
    };
  }

  private validateDateRange(from: string, to: string) {
    if (this.parseDate(from).getTime() > this.parseDate(to).getTime()) {
      throw new BadRequestException('La fecha from no puede ser mayor que to');
    }
  }

  private toTrendMetric(current: number, baseline: number): TrendMetric {
    return {
      current: this.roundMoney(current),
      baseline: this.roundMoney(baseline),
      changePercent: this.getChangePercent(current, baseline),
    };
  }

  private getChangePercent(current: number, baseline: number) {
    if (!baseline) return null;

    return this.roundPercent(((current - baseline) / baseline) * 100);
  }

  private parseDate(value: string) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  private formatDate(value: Date) {
    return value.toISOString().slice(0, 10);
  }

  private addDays(value: Date, days: number) {
    const nextDate = new Date(value);
    nextDate.setUTCDate(nextDate.getUTCDate() + days);
    return nextDate;
  }

  private diffInDays(from: Date, to: Date) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((to.getTime() - from.getTime()) / millisecondsPerDay);
  }

  private roundMoney(value: number) {
    return Number(value.toFixed(2));
  }

  private roundPercent(value: number) {
    return Number(value.toFixed(2));
  }
}
