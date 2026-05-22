import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsString, MaxLength } from 'class-validator';
import { CurrencyEnum } from 'src/config/enums/currency.enum';

export class CreateWalletDto {
  @ApiProperty({
    description: 'Nombre de la billetera.',
    example: 'Cuenta principal',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'URL o identificador del avatar de la billetera.',
    example: 'https://example.com/wallet-avatar.png',
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    description:
      'Balance inicial de la billetera. Luego se mantiene por transacciones.',
    example: '1500.00',
    pattern: '^\\d+\\.\\d{2}$',
  })
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  balance: string;

  @ApiProperty({
    description: 'Moneda de la billetera.',
    enum: CurrencyEnum,
    enumName: 'CurrencyEnum',
    example: CurrencyEnum.PEN,
  })
  @IsEnum(CurrencyEnum)
  currency: string;
}
