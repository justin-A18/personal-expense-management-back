import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard, type CustomRequest } from 'src/auth/guards/auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletsService } from './wallets.service';

@ApiTags('Wallets')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'JWT ausente, inválido o expirado.' })
@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear billetera',
    description:
      'Crea una billetera para el usuario autenticado. El balance inicial se guarda en la billetera.',
  })
  @ApiBody({ type: CreateWalletDto })
  @ApiCreatedResponse({ description: 'Billetera creada correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos de billetera inválidos.' })
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: CustomRequest) {
    return this.walletsService.create(createWalletDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar billeteras',
    description: 'Devuelve las billeteras del usuario autenticado.',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiOkResponse({ description: 'Billeteras obtenidas correctamente.' })
  findAll(@Query() paginationDto: PaginationDto, @Req() req: CustomRequest) {
    return this.walletsService.findAll(paginationDto, req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener billetera',
    description: 'Devuelve una billetera del usuario autenticado por UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la billetera.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiOkResponse({ description: 'Billetera obtenida correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findOne(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.walletsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar billetera',
    description:
      'Actualiza nombre, avatar o moneda. El balance no se edita aquí; cambia por transacciones.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la billetera.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiBody({ type: UpdateWalletDto })
  @ApiOkResponse({ description: 'Billetera actualizada correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Req() req: CustomRequest,
  ) {
    return this.walletsService.update(id, updateWalletDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar billetera',
    description: 'Elimina una billetera del usuario autenticado.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la billetera.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiOkResponse({ description: 'Billetera eliminada correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.walletsService.remove(id, req.user.id);
  }
}
