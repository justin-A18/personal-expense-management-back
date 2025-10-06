import { IsDateString, IsUUID } from 'class-validator';

export class ReportDto {
  @IsUUID()
  walletId: string;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
