import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoCriarOrdemServico } from '../aplicacao/criar-ordem-servico.caso-uso';
import { CasoUsoAbrirOrdemServico } from '../aplicacao/abrir-ordem-servico.caso-uso';
import { CasoUsoExecutarAcaoOrdemServico } from '../aplicacao/executar-acao-ordem-servico.caso-uso';
import { CasoUsoListarOrdensServico } from '../aplicacao/listar-ordens-servico.caso-uso';
import { CasoUsoObterOrdemServico } from '../aplicacao/obter-ordem-servico.caso-uso';
import { AcaoOrdemServico } from '../dominio/acao-ordem-servico';
import {
  DadosAbrirOrdemServico,
  DadosCriarOrdemServico,
  DadosListarOrdensServico,
} from './ordem-servico.dto';

@ApiTags('ordens-servico')
@Controller('ordens-servico')
export class ControladorOrdemServico {
  constructor(
    private readonly criarOrdemServico: CasoUsoCriarOrdemServico,
    private readonly abrirOrdemServico: CasoUsoAbrirOrdemServico,
    private readonly obterOrdemServico: CasoUsoObterOrdemServico,
    private readonly listarOrdensServico: CasoUsoListarOrdensServico,
    private readonly executarAcaoOrdemServico: CasoUsoExecutarAcaoOrdemServico,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Ordem de serviço criada' })
  @ApiNotFoundResponse({ description: 'Cliente ou veículo não encontrado' })
  criar(@Body() dadosEntrada: DadosCriarOrdemServico) {
    return this.criarOrdemServico.executar(dadosEntrada);
  }

  @Post('abertura')
  @ApiCreatedResponse({ description: 'Ordem de serviço aberta por CPF/CNPJ' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  criarPeloFluxoDeAbertura(@Body() dadosEntrada: DadosAbrirOrdemServico) {
    return this.abrirOrdemServico.executar(dadosEntrada);
  }

  @Get()
  @ApiOkResponse({ description: 'Ordens de serviço listadas' })
  listar(@Query() filtros: DadosListarOrdensServico) {
    return this.listarOrdensServico.executar(filtros);
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Ordem de serviço encontrada' })
  @ApiNotFoundResponse({ description: 'Ordem de serviço não encontrada' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterOrdemServico.executar(identificador);
  }

  @Patch(':identificador/acoes/:acao')
  @ApiOkResponse({ description: 'Ação executada e status atualizado' })
  @ApiNotFoundResponse({ description: 'Ordem de serviço não encontrada' })
  @ApiParam({ name: 'acao', enum: AcaoOrdemServico })
  executarAcao(
    @Param('identificador') identificador: string,
    @Param('acao', new ParseEnumPipe(AcaoOrdemServico))
    acao: AcaoOrdemServico,
  ) {
    return this.executarAcaoOrdemServico.executar(identificador, acao);
  }
}
