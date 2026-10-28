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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CasoUsoAtualizarPecaInsumo } from '../aplicacao/atualizar-peca-insumo.caso-uso';
import { CasoUsoCriarPecaInsumo } from '../aplicacao/criar-peca-insumo.caso-uso';
import { CasoUsoExcluirPecaInsumo } from '../aplicacao/excluir-peca-insumo.caso-uso';
import { CasoUsoListarPecasInsumos } from '../aplicacao/listar-pecas-insumos.caso-uso';
import { CasoUsoMovimentarEstoque } from '../aplicacao/movimentar-estoque.caso-uso';
import { CasoUsoObterPecaInsumo } from '../aplicacao/obter-peca-insumo.caso-uso';
import {
  DadosAtualizarPecaInsumo,
  DadosCriarPecaInsumo,
  DadosMovimentarEstoque,
} from './peca-insumo.dto';

@ApiTags('peças e insumos')
@Controller('pecas-insumos')
export class ControladorPecaInsumo {
  constructor(
    private readonly criarPecaInsumo: CasoUsoCriarPecaInsumo,
    private readonly obterPecaInsumo: CasoUsoObterPecaInsumo,
    private readonly listarPecasInsumos: CasoUsoListarPecasInsumos,
    private readonly atualizarPecaInsumo: CasoUsoAtualizarPecaInsumo,
    private readonly movimentarEstoque: CasoUsoMovimentarEstoque,
    private readonly excluirPecaInsumo: CasoUsoExcluirPecaInsumo,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Peça ou insumo cadastrado' })
  @ApiConflictResponse({ description: 'Código já cadastrado' })
  criar(@Body() dadosEntrada: DadosCriarPecaInsumo) {
    return this.criarPecaInsumo.executar(dadosEntrada);
  }

  @Get()
  @ApiOkResponse({ description: 'Peças e insumos listados' })
  listar() {
    return this.listarPecasInsumos.executar();
  }

  @Get(':identificador')
  @ApiOkResponse({ description: 'Peça ou insumo encontrado' })
  @ApiNotFoundResponse({ description: 'Peça ou insumo não encontrado' })
  buscarPorId(@Param('identificador') identificador: string) {
    return this.obterPecaInsumo.executar(identificador);
  }

  @Patch(':identificador/estoque')
  @ApiOkResponse({ description: 'Estoque movimentado' })
  @ApiNotFoundResponse({ description: 'Peça ou insumo não encontrado' })
  movimentar(
    @Param('identificador') identificador: string,
    @Body() dadosEntrada: DadosMovimentarEstoque,
  ) {
    return this.movimentarEstoque.executar(
      identificador,
      dadosEntrada.tipo,
      dadosEntrada.quantidade,
    );
  }

  @Patch(':identificador')
  @ApiOkResponse({ description: 'Peça ou insumo atualizado' })
  @ApiNotFoundResponse({ description: 'Peça ou insumo não encontrado' })
  @ApiConflictResponse({ description: 'Código já cadastrado' })
  atualizar(
    @Param('identificador') identificador: string,
    @Body() dadosEntrada: DadosAtualizarPecaInsumo,
  ) {
    return this.atualizarPecaInsumo.executar(identificador, dadosEntrada);
  }

  @Delete(':identificador')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Peça ou insumo excluído' })
  @ApiNotFoundResponse({ description: 'Peça ou insumo não encontrado' })
  @ApiConflictResponse({
    description: 'Peça ou insumo vinculado a uma ordem de serviço',
  })
  async excluir(@Param('identificador') identificador: string): Promise<void> {
    await this.excluirPecaInsumo.executar(identificador);
  }
}
