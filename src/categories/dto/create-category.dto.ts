import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría.',
    example: 'Alimentación',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Descripción breve de la categoría.',
    example: 'Compras de comida, supermercado y restaurantes.',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Nombre de icono o identificador visual.',
    example: 'utensils',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  icon: string;

  @ApiProperty({
    description: 'Tipo de transacción para la que aplica la categoría.',
    enum: TYPE_TRANSACTION,
    enumName: 'TYPE_TRANSACTION',
    example: TYPE_TRANSACTION.EXPENSE,
  })
  @IsEnum(TYPE_TRANSACTION)
  type: TYPE_TRANSACTION;

  @ApiProperty({
    description: 'UUID de la billetera a la que pertenece la categoría.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @IsString()
  walletId: string;
}
