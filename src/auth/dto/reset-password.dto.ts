import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Correo al que se enviará el enlace de recuperación.',
    example: 'justin@example.com',
  })
  @IsEmail()
  email: string;
}
