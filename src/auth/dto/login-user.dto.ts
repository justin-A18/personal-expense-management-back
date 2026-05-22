import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Correo registrado del usuario.',
    example: 'justin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario. Mínimo 6 caracteres.',
    example: 'secret123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
