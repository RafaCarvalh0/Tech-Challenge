import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RotaPublica } from '../modulos/autenticacao/apresentacao/rota-publica.decorador';

@ApiTags('saude')
@Controller('saude')
export class ControladorSaude {
  @Get()
  @RotaPublica()
  @ApiOkResponse({ schema: { example: { situacao: 'ok' } } })
  obterSaude(): { situacao: 'ok' } {
    return { situacao: 'ok' };
  }
}
