import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoAtualizarVeiculo } from '../aplicacao/atualizar-veiculo.caso-uso';
import { CasoUsoCriarVeiculo } from '../aplicacao/criar-veiculo.caso-uso';
import { CasoUsoExcluirVeiculo } from '../aplicacao/excluir-veiculo.caso-uso';
import { CasoUsoListarVeiculos } from '../aplicacao/listar-veiculos.caso-uso';
import { CasoUsoObterVeiculo } from '../aplicacao/obter-veiculo.caso-uso';
import { DadosAtualizarVeiculo, DadosCriarVeiculo } from './veiculo.dto';

@ApiTags('veiculos')
@Controller('veiculos')
export class ControladorVeiculo {
  constructor(
    private readonly criarVeiculo: CasoUsoCriarVeiculo,
    private readonly obterVeiculo: CasoUsoObterVeiculo,
    private readonly listarVeiculos: CasoUsoListarVeiculos,
    private readonly atualizarVeiculo: CasoUsoAtualizarVeiculo,
    private readonly excluirVeiculo: CasoUsoExcluirVeiculo,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Veículo cadastrado' })
  @ApiConflictResponse({ description: 'Placa já cadastrada' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  criar(@Body() dadosEntrada: DadosCriarVeiculo) {
    return this.criarVeiculo.executar(dadosEntrada);
  }

  @Get()
  @ApiOkResponse({ description: 'Veículos listados' })
  listar(@Query('clienteId') clienteId?: string) {
    return this.listarVeiculos.executar(clienteId);
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Veículo encontrado' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterVeiculo.executar(identificador);
  }

  @Patch(':identificador')
  @ApiOkResponse({ description: 'Veículo atualizado' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  @ApiConflictResponse({ description: 'Placa já cadastrada' })
  atualizar(
    @Param('identificador') identificador: string,
    @Body() dadosEntrada: DadosAtualizarVeiculo,
  ) {
    return this.atualizarVeiculo.executar(identificador, dadosEntrada);
  }

  @Delete(':identificador')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Veículo excluído' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  @ApiConflictResponse({ description: 'Veículo possui ordens de serviço' })
  async excluir(@Param('identificador') identificador: string): Promise<void> {
    await this.excluirVeiculo.executar(identificador);
  }
}
