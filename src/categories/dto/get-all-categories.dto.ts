import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class GetAllCategoriesDto extends PaginationDto {
  @ApiProperty({
    description: 'UUID de la billetera cuyas categorías se listarán.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @IsString()
  walletId: string;

  @ApiPropertyOptional({
    description: 'Filtra categorías por tipo de transacción.',
    enum: TYPE_TRANSACTION,
    enumName: 'TYPE_TRANSACTION',
    example: TYPE_TRANSACTION.EXPENSE,
  })
  @IsEnum(TYPE_TRANSACTION)
  @IsOptional()
  type: TYPE_TRANSACTION;

  @ApiPropertyOptional({
    description: 'Busca categorías por nombre.',
    example: 'Alimentación',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string;
}
