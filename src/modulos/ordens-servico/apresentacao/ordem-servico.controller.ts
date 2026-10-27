import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoCriarOrdemServico } from '../aplicacao/criar-ordem-servico.caso-uso';
import { CasoUsoObterOrdemServico } from '../aplicacao/obter-ordem-servico.caso-uso';
import { DadosCriarOrdemServico } from './ordem-servico.dto';

@ApiTags('ordens-servico')
@Controller('ordens-servico')
export class ControladorOrdemServico {
  constructor(
    private readonly criarOrdemServico: CasoUsoCriarOrdemServico,
    private readonly obterOrdemServico: CasoUsoObterOrdemServico,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Ordem de serviço criada' })
  @ApiNotFoundResponse({ description: 'Cliente ou veículo não encontrado' })
  criar(@Body() dadosEntrada: DadosCriarOrdemServico) {
    return this.criarOrdemServico.executar(dadosEntrada);
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Ordem de serviço encontrada' })
  @ApiNotFoundResponse({ description: 'Ordem de serviço não encontrada' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterOrdemServico.executar(identificador);
  }
}
