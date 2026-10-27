import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoCriarCliente } from '../aplicacao/criar-cliente.caso-uso';
import { CasoUsoObterCliente } from '../aplicacao/obter-cliente.caso-uso';
import { DadosCriarCliente } from './cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ControladorCliente {
  constructor(
    private readonly criarCliente: CasoUsoCriarCliente,
    private readonly obterCliente: CasoUsoObterCliente,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Cliente cadastrado' })
  @ApiConflictResponse({ description: 'CPF/CNPJ já cadastrado' })
  criar(@Body() dadosEntrada: DadosCriarCliente) {
    return this.criarCliente.executar(dadosEntrada);
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Cliente encontrado' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterCliente.executar(identificador);
  }
}
