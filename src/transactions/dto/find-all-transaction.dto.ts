import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ORDER_BY } from 'src/config/enums/order-by.enum';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class FindAllTransactionDto {
  @ApiProperty({
    description: 'UUID de la billetera del usuario autenticado.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @IsString()
  walletId: string;

  @ApiPropertyOptional({
    description: 'Filtra por tipo de transacción.',
    enum: TYPE_TRANSACTION,
    enumName: 'TYPE_TRANSACTION',
    example: TYPE_TRANSACTION.EXPENSE,
    nullable: true,
  })
  @IsEnum(TYPE_TRANSACTION)
  @IsOptional()
  type: TYPE_TRANSACTION | null;

  @ApiPropertyOptional({
    description: 'Fecha inicial del rango.',
    example: '2026-05-01',
    format: 'date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  from: string | null;

  @ApiPropertyOptional({
    description: 'Fecha final del rango.',
    example: '2026-05-31',
    format: 'date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  to: string | null;

  @ApiPropertyOptional({
    description: 'Orden por fecha de transacción.',
    enum: ORDER_BY,
    enumName: 'ORDER_BY',
    example: ORDER_BY.DESC,
    nullable: true,
  })
  @IsEnum(ORDER_BY)
  @IsOptional()
  orderBy: ORDER_BY | null;
}
