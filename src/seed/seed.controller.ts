import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Cargar datos mock',
    description:
      'Inserta datos mock de usuarios, categorías, billeteras y transacciones sin duplicar registros existentes.',
  })
  @ApiOkResponse({ description: 'Seed ejecutado correctamente.' })
  runSeed() {
    return this.seedService.run();
  }
}
