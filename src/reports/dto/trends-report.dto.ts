import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';

export enum TrendsComparisonMode {
  PREVIOUS_PERIOD = 'previous_period',
  LAST_3_MONTHS = 'last_3_months',
  LAST_6_MONTHS = 'last_6_months',
}

export class TrendsReportDto {
  @ApiProperty({
    description: 'UUID de la billetera del usuario autenticado.',
    example: '8a1fc2ce-4c7c-4d89-8b6f-11ef63d2ef09',
  })
  @IsUUID()
  walletId: string;

  @ApiProperty({
    description: 'Fecha inicial del periodo actual.',
    example: '2026-05-01',
    format: 'date',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    description: 'Fecha final del periodo actual.',
    example: '2026-05-31',
    format: 'date',
  })
  @IsDateString()
  to: string;

  @ApiProperty({
    description: 'Modo de comparación para calcular el baseline.',
    enum: TrendsComparisonMode,
    enumName: 'TrendsComparisonMode',
    example: TrendsComparisonMode.PREVIOUS_PERIOD,
  })
  @IsEnum(TrendsComparisonMode)
  comparisonMode: TrendsComparisonMode;
}
