import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ORDER_BY } from 'src/config/enums/order-by.enum';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class FindAllTransactionDto extends PaginationDto {
  @IsString()
  walletId: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsEnum(TYPE_TRANSACTION)
  @IsOptional()
  type: TYPE_TRANSACTION;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsEnum(ORDER_BY)
  @IsOptional()
  orderBy: ORDER_BY;
}
