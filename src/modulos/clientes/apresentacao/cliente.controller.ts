import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoCriarCliente } from '../aplicacao/criar-cliente.caso-uso';
import { CasoUsoAtualizarCliente } from '../aplicacao/atualizar-cliente.caso-uso';
import { CasoUsoExcluirCliente } from '../aplicacao/excluir-cliente.caso-uso';
import { CasoUsoListarClientes } from '../aplicacao/listar-clientes.caso-uso';
import { CasoUsoObterCliente } from '../aplicacao/obter-cliente.caso-uso';
import { DadosAtualizarCliente, DadosCriarCliente } from './cliente.dto';

@ApiTags('clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ControladorCliente {
  constructor(
    private readonly criarCliente: CasoUsoCriarCliente,
    private readonly obterCliente: CasoUsoObterCliente,
    private readonly listarClientes: CasoUsoListarClientes,
    private readonly atualizarCliente: CasoUsoAtualizarCliente,
    private readonly excluirCliente: CasoUsoExcluirCliente,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Cliente cadastrado' })
  @ApiConflictResponse({ description: 'CPF/CNPJ já cadastrado' })
  criar(@Body() dadosEntrada: DadosCriarCliente) {
    return this.criarCliente.executar(dadosEntrada);
  }

  @Get()
  @ApiOkResponse({ description: 'Clientes listados' })
  listar() {
    return this.listarClientes.executar();
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Cliente encontrado' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterCliente.executar(identificador);
  }

  @Patch(':identificador')
  @ApiOkResponse({ description: 'Cliente atualizado' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  @ApiConflictResponse({ description: 'CPF/CNPJ já cadastrado' })
  atualizar(
    @Param('identificador') identificador: string,
    @Body() dadosEntrada: DadosAtualizarCliente,
  ) {
    return this.atualizarCliente.executar(identificador, dadosEntrada);
  }

  @Delete(':identificador')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Cliente excluído' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  @ApiConflictResponse({ description: 'Cliente possui vínculos' })
  async excluir(@Param('identificador') identificador: string): Promise<void> {
    await this.excluirCliente.executar(identificador);
  }
}
