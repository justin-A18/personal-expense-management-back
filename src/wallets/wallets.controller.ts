import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { AuthGuard, type CustomRequest } from 'src/auth/guards/auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: CustomRequest) {
    return this.walletsService.create(createWalletDto, req.user.id);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Req() req: CustomRequest) {
    return this.walletsService.findAll(paginationDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.walletsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: CustomRequest,
  ) {
    return this.walletsService.update(id, updateWalletDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.walletsService.remove(id, req.user.id);
  }
}
