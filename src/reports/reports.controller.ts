import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard, type CustomRequest } from 'src/auth/guards/auth.guard';
import { ReportDto } from './dto/report.dto';
import { ReportByTypeDto } from './dto/report-by-type.dto';
import { ReportsService } from './reports.service';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import {
  TrendsComparisonMode,
  TrendsReportDto,
} from './dto/trends-report.dto';

@ApiTags('Reports')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'JWT ausente, inválido o expirado.' })
@Controller('reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('trends')
  @ApiOperation({
    summary: 'Tendencias financieras',
    description:
      'Compara un periodo actual contra un baseline para mostrar variaciones, rankings, distribución de gasto, patrón temporal e insights accionables.',
  })
  @ApiQuery({
    name: 'walletId',
    required: true,
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiQuery({ name: 'from', required: true, example: '2026-05-01' })
  @ApiQuery({ name: 'to', required: true, example: '2026-05-31' })
  @ApiQuery({
    name: 'comparisonMode',
    required: true,
    enum: TrendsComparisonMode,
    example: TrendsComparisonMode.PREVIOUS_PERIOD,
  })
  @ApiOkResponse({
    description:
      'Tendencias calculadas correctamente con comparación, distribución e insights.',
  })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findTrends(
    @Query() trendsReportDto: TrendsReportDto,
    @Req() req: CustomRequest,
  ): Promise<unknown> {
    return this.reportsService.findTrends(trendsReportDto, req.user.id);
  }

  @Get('weekly-report')
  @ApiOperation({
    summary: 'Reporte semanal por tipo',
    description:
      'Devuelve totales diarios para una billetera y tipo de transacción dentro de un rango de fechas.',
  })
  @ApiQuery({
    name: 'walletId',
    required: true,
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiQuery({ name: 'from', required: true, example: '2026-05-18' })
  @ApiQuery({ name: 'to', required: true, example: '2026-05-24' })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: TYPE_TRANSACTION,
    example: TYPE_TRANSACTION.EXPENSE,
  })
  @ApiOkResponse({ description: 'Reporte semanal obtenido correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findWeeklyReport(
    @Query() findWeeklyReportDto: ReportByTypeDto,
    @Req() req: CustomRequest,
  ) {
    return this.reportsService.findWeeklyReport(
      findWeeklyReportDto,
      req.user.id,
    );
  }

  @Get('monthly-report')
  @ApiOperation({
    summary: 'Reporte mensual',
    description:
      'Devuelve totales mensuales de ingresos y gastos para una billetera dentro de un rango de fechas.',
  })
  @ApiQuery({
    name: 'walletId',
    required: true,
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiQuery({ name: 'from', required: true, example: '2026-01-01' })
  @ApiQuery({ name: 'to', required: true, example: '2026-12-31' })
  @ApiOkResponse({ description: 'Reporte mensual obtenido correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findMonthlyReport(
    @Query() findWeeklyReportDto: ReportDto,
    @Req() req: CustomRequest,
  ) {
    return this.reportsService.findMonthlyReport(
      findWeeklyReportDto,
      req.user.id,
    );
  }
}
