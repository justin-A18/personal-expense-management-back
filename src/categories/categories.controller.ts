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
import { TYPE_TRANSACTION } from 'src/config/enums/type-transaction.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetAllCategoriesDto } from './dto/get-all-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'JWT ausente, inválido o expirado.' })
@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear categoría',
    description: 'Crea una categoría para clasificar transacciones.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ description: 'Categoría creada exitosamente.' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o categoría duplicada.',
  })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: CustomRequest,
  ) {
    return this.categoriesService.create(createCategoryDto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar categorías',
    description: 'Lista categorías con filtros opcionales por tipo y nombre.',
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
  @ApiQuery({ name: 'name', required: false, example: 'Alimentación' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiOkResponse({ description: 'Categorías obtenidas exitosamente.' })
  @ApiNotFoundResponse({
    description: 'Billetera inexistente o ajena al usuario.',
  })
  findAll(
    @Query() findAllCategoriesDto: GetAllCategoriesDto,
    @Req() req: CustomRequest,
  ) {
    return this.categoriesService.findAll(findAllCategoriesDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar categoría',
    description: 'Actualiza los datos de una categoría existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la categoría.',
    example: 'f2a8e270-14f1-4c69-a219-4b1704a3839f',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ description: 'Categoría actualizada exitosamente.' })
  @ApiNotFoundResponse({
    description: 'Categoría inexistente o ajena al usuario.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: CustomRequest,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar categoría',
    description: 'Elimina una categoría si no tiene restricciones de base de datos.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la categoría.',
    example: 'f2a8e270-14f1-4c69-a219-4b1704a3839f',
  })
  @ApiOkResponse({ description: 'Categoría eliminada exitosamente.' })
  @ApiNotFoundResponse({
    description: 'Categoría inexistente o ajena al usuario.',
  })
  remove(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.categoriesService.remove(id, req.user.id);
  }
}
