import { IsDateString, IsUUID } from 'class-validator';

export class FindWeeklyReportDto {
  @IsUUID()
  walletId: string;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
