import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario',
    description:
      'Endpoint legacy. La entidad de usuario usa UUID, pero este controlador convierte el parámetro a number.',
    deprecated: true,
  })
  @ApiParam({ name: 'id', description: 'ID legacy del usuario.', example: 1 })
  @ApiOkResponse({ description: 'Usuario obtenido correctamente.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description:
      'Endpoint legacy pendiente de alinear con UUID y autenticación.',
    deprecated: true,
  })
  @ApiParam({ name: 'id', description: 'ID legacy del usuario.', example: 1 })
  @ApiOkResponse({ description: 'Usuario actualizado correctamente.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description:
      'Endpoint legacy pendiente de alinear con UUID y autenticación.',
    deprecated: true,
  })
  @ApiParam({ name: 'id', description: 'ID legacy del usuario.', example: 1 })
  @ApiOkResponse({ description: 'Usuario eliminado correctamente.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
