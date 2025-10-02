import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class CreateTransactionDto {
  @IsEnum(TYPE_TRANSACTION)
  type: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  amount: string;

  @IsDateString()
  date: string;

  @IsString()
  walletId: string;

  @IsString()
  category: string;
}
