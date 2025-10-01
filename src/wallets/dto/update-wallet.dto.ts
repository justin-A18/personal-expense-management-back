import { CreateWalletDto } from './create-wallet.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}
