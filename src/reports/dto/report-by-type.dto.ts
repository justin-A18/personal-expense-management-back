import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReportDto } from './report.dto';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class ReportByTypeDto extends ReportDto {
  @ApiProperty({
    description: 'Tipo de transacción a reportar.',
    enum: TYPE_TRANSACTION,
    enumName: 'TYPE_TRANSACTION',
    example: TYPE_TRANSACTION.EXPENSE,
  })
  @IsEnum(TYPE_TRANSACTION)
  type: string;
}
