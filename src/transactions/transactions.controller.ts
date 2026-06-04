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
import { ORDER_BY } from 'src/config/enums/order-by.enum';
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindAllTransactionDto } from './dto/find-all-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'JWT ausente, inválido o expirado.' })
@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear transacción',
    description:
      'Crea una transacción y actualiza el balance persistido de la billetera de forma atómica.',
  })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({ description: 'Transacción creada correctamente.' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o saldo insuficiente para un gasto.',
  })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: CustomRequest,
  ) {
    return this.transactionsService.create(createTransactionDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar transacciones',
    description:
      'Lista transacciones de una billetera del usuario autenticado con filtros por tipo, rango de fechas y paginación.',
  })
  @ApiQuery({
    name: 'walletId',
    required: true,
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TYPE_TRANSACTION,
    example: TYPE_TRANSACTION.EXPENSE,
  })
  @ApiQuery({ name: 'from', required: false, example: '2026-05-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-05-31' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ORDER_BY,
    example: ORDER_BY.DESC,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiOkResponse({ description: 'Transacciones obtenidas correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findAllByQuery(
    @Query() findAllTransactionDto: FindAllTransactionDto,
    @Req() req: CustomRequest,
  ) {
    return this.transactionsService.findAll(
      findAllTransactionDto,
      req.user.id,
    );
  }

  @Post('all')
  @ApiOperation({
    summary: 'Listar transacciones por body',
    description:
      'Endpoint legacy para listar transacciones. Se recomienda usar GET /transactions.',
    deprecated: true,
  })
  @ApiBody({ type: FindAllTransactionDto })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiOkResponse({ description: 'Transacciones obtenidas correctamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findAll(
    @Body() findAllTransactionDto: FindAllTransactionDto,
    @Req() req: CustomRequest,
  ) {
    return this.transactionsService.findAll(
      findAllTransactionDto,
      req.user.id,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener transacción',
    description: 'Devuelve una transacción del usuario autenticado por UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la transacción.',
    example: 'b5d7c2f2-82f9-4a21-b7f3-bb760a5aa9bb',
  })
  @ApiOkResponse({ description: 'Transacción obtenida correctamente.' })
  @ApiNotFoundResponse({
    description: 'Transacción inexistente o ajena al usuario.',
  })
  findOne(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.transactionsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar transacción',
    description:
      'Actualiza una transacción y recalcula el balance persistido revirtiendo el movimiento anterior y aplicando el nuevo.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la transacción.',
    example: 'b5d7c2f2-82f9-4a21-b7f3-bb760a5aa9bb',
  })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiOkResponse({ description: 'Transacción actualizada correctamente.' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o saldo insuficiente.',
  })
  @ApiNotFoundResponse({ description: 'Transacción o billetera inexistente.' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: CustomRequest,
  ) {
    return this.transactionsService.update(
      id,
      updateTransactionDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar transacción',
    description:
      'Elimina una transacción y revierte su efecto sobre el balance persistido.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la transacción.',
    example: 'b5d7c2f2-82f9-4a21-b7f3-bb760a5aa9bb',
  })
  @ApiOkResponse({ description: 'Transacción eliminada correctamente.' })
  @ApiNotFoundResponse({
    description: 'Transacción inexistente o ajena al usuario.',
  })
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.transactionsService.remove(id, req.user.id);
  }
}
