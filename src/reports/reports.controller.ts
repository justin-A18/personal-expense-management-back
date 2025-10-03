import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FindWeeklyReportDto } from './dto/find-weekly-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('weekly-report')
  findWeeklyReport(@Query() findWeeklyReportDto: FindWeeklyReportDto) {
    return this.reportsService.findWeeklyReport(findWeeklyReportDto);
  }
}
