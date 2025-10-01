import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly offset?: number;
}
