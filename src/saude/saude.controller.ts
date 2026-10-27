import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('saude')
@Controller('saude')
export class ControladorSaude {
  @Get()
  @ApiOkResponse({ schema: { example: { situacao: 'ok' } } })
  obterSaude(): { situacao: 'ok' } {
    return { situacao: 'ok' };
  }
}
