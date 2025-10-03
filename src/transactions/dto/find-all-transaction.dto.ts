import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ORDER_BY } from 'src/config/enums/order-by.enum';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class FindAllTransactionDto {
  @IsString()
  walletId: string;

  @ValidateIf((o: FindAllTransactionDto) => o.category !== null)
  @IsString()
  @IsOptional()
  category: string | null;

  @ValidateIf((o: FindAllTransactionDto) => o.type !== null)
  @IsEnum(TYPE_TRANSACTION)
  @IsOptional()
  type: TYPE_TRANSACTION | null;

  @ValidateIf((o: FindAllTransactionDto) => o.date !== null)
  @IsDateString()
  @IsOptional()
  date: string | null;

  @ValidateIf((o: FindAllTransactionDto) => o.orderBy !== null)
  @IsEnum(ORDER_BY)
  @IsOptional()
  orderBy: ORDER_BY | null;
}
