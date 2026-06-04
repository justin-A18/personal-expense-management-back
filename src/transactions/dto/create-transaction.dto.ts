import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Tipo de movimiento financiero.',
    enum: TYPE_TRANSACTION,
    enumName: 'TYPE_TRANSACTION',
    example: TYPE_TRANSACTION.EXPENSE,
  })
  @IsEnum(TYPE_TRANSACTION)
  type: TYPE_TRANSACTION;

  @ApiProperty({
    description: 'Descripción corta de la transacción.',
    example: 'Compra de supermercado',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Monto positivo. Acepta enteros o hasta 2 decimales.',
    example: '85.5',
    pattern: '^\\d+(\\.\\d{1,2})?$',
  })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amount must be a positive number with up to 2 decimal places',
  })
  amount: string;

  @ApiProperty({
    description: 'Fecha contable de la transacción.',
    example: '2026-05-21',
    format: 'date',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'UUID de la billetera a la que pertenece la transacción.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @IsString()
  walletId: string;

  @ApiProperty({
    description: 'UUID de la categoría a la que pertenece la transacción.',
    example: 'f2a8e270-14f1-4c69-a219-4b1704a3839f',
  })
  @IsString()
  categoryId: string;
}
