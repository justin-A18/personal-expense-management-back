import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Nueva contraseña. Mínimo 6 caracteres.',
    example: 'newSecret123',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
