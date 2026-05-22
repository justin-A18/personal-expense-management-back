import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({
    description: 'Nombre visible del usuario.',
    example: 'Justin Dev',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
