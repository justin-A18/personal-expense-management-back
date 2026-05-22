import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';

export class UpdateWalletDto extends PartialType(
  OmitType(CreateWalletDto, ['balance'] as const),
) {}
