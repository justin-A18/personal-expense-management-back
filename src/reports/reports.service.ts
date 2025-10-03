import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { WalletsService } from 'src/wallets/wallets.service';
import { Repository } from 'typeorm';
import { FindWeeklyReportDto } from './dto/find-weekly-report.dto';
import { ReportRow } from './interfaces/report-transaction.interface';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private TransactionsRepository: Repository<Transaction>,
    private readonly walletsService: WalletsService,
  ) {}

  async findWeeklyReport(findWeeklyReportDto: FindWeeklyReportDto) {
    const { from, to, walletId } = findWeeklyReportDto;

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
      GROUP BY d.dia
      ORDER BY d.dia ASC;
      `,
      [from, to, walletId],
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
}
