import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Cantidad máxima de elementos a devolver.',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsPositive()
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly limit?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos a saltar.',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly offset?: number;
}
