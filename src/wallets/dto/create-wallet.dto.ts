import { IsDecimal, IsEnum, IsString, MaxLength } from 'class-validator';
import { CurrencyEnum } from 'src/config/enums/currency.enum';

export class CreateWalletDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  avatar: string;

  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  balance: string;

  @IsEnum(CurrencyEnum)
  currency: string;
}
