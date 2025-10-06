import { IsEnum } from 'class-validator';
import { ReportDto } from './report.dto';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class ReportByTypeDto extends ReportDto {
  @IsEnum(TYPE_TRANSACTION)
  type: string;
}
