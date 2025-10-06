import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';
import { ReportByTypeDto } from './dto/report-by-type.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('weekly-report')
  findWeeklyReport(@Query() findWeeklyReportDto: ReportByTypeDto) {
    return this.reportsService.findWeeklyReport(findWeeklyReportDto);
  }

  @Get('monthly-report')
  findMonthlyReport(@Query() findWeeklyReportDto: ReportDto) {
    return this.reportsService.findMonthlyReport(findWeeklyReportDto);
  }
}
