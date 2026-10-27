import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoCriarVeiculo } from '../aplicacao/criar-veiculo.caso-uso';
import { CasoUsoObterVeiculo } from '../aplicacao/obter-veiculo.caso-uso';
import { DadosCriarVeiculo } from './veiculo.dto';

@ApiTags('veiculos')
@Controller('veiculos')
export class ControladorVeiculo {
  constructor(
    private readonly criarVeiculo: CasoUsoCriarVeiculo,
    private readonly obterVeiculo: CasoUsoObterVeiculo,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Veículo cadastrado' })
  @ApiConflictResponse({ description: 'Placa já cadastrada' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  criar(@Body() dadosEntrada: DadosCriarVeiculo) {
    return this.criarVeiculo.executar(dadosEntrada);
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Veículo encontrado' })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterVeiculo.executar(identificador);
  }
}
