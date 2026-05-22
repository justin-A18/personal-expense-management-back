import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class ReportDto {
  @ApiProperty({
    description: 'UUID de la billetera del usuario autenticado.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    description: 'Fecha inicial del reporte.',
    example: '2026-05-01',
    format: 'date',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    description: 'Fecha final del reporte.',
    example: '2026-05-31',
    format: 'date',
  })
  @IsDateString()
  to: string;
}
