import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private TransactionsRepository: Repository<Transaction>,
    private readonly walletsService: WalletsService,
  ) {}

  async findWeeklyReport(findWeeklyReportDto: ReportByTypeDto) {
    const { from, to, walletId, type } = findWeeklyReportDto;

    await this.walletsService.findOne(walletId);

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

  async findMonthlyReport(findMonthlyReportDto: ReportDto) {
    const { from, to, walletId } = findMonthlyReportDto;

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
}
