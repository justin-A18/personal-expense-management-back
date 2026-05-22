import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  LoginUserDto,
  RegisterUserDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate-email/:token')
  @ApiOperation({
    summary: 'Validar email',
    description:
      'Valida el correo del usuario usando el token enviado por email.',
  })
  @ApiParam({
    name: 'token',
    description: 'Token de validación de correo.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiOkResponse({ description: 'Email validado correctamente.' })
  @ApiBadRequestResponse({ description: 'Token inválido o expirado.' })
  validateEmail(@Param('token') token: string) {
    return this.authService.validateEmail(token);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve el token de acceso.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    description: 'Login correcto. Devuelve datos del usuario y JWT.',
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas.' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Crea una cuenta de usuario y envía validación por email.',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ description: 'Usuario registrado correctamente.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o email duplicado.' })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('change-password/:token')
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description: 'Actualiza la contraseña usando un token de recuperación.',
  })
  @ApiParam({
    name: 'token',
    description: 'Token de recuperación de contraseña.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: 'Contraseña actualizada correctamente.' })
  @ApiBadRequestResponse({
    description: 'Token inválido o contraseña inválida.',
  })
  changePassword(
    @Param('token') token: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(token, changePasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un correo con enlace para cambiar contraseña.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: 'Correo de recuperación enviado.' })
  @ApiNotFoundResponse({ description: 'No existe un usuario con ese email.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
