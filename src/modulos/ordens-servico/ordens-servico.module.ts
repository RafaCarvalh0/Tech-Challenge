import { Module } from '@nestjs/common';

import { ServicoPrisma } from '../../banco-dados/prisma.servico';
import {
  REPOSITORIO_CLIENTE,
  RepositorioCliente,
} from '../clientes/aplicacao/cliente.repositorio';
import { ModuloClientes } from '../clientes/clientes.module';
import {
  REPOSITORIO_VEICULO,
  RepositorioVeiculo,
} from '../veiculos/aplicacao/veiculo.repositorio';
import { ModuloVeiculos } from '../veiculos/veiculos.module';
import {
  REPOSITORIO_SERVICO,
  RepositorioServico,
} from '../servicos/aplicacao/servico.repositorio';
import { ModuloServicos } from '../servicos/servicos.module';
import {
  REPOSITORIO_PECA_INSUMO,
  RepositorioPecaInsumo,
} from '../pecas-insumos/aplicacao/peca-insumo.repositorio';
import { ModuloPecasInsumos } from '../pecas-insumos/pecas-insumos.module';
import { CasoUsoCriarOrdemServico } from './aplicacao/criar-ordem-servico.caso-uso';
import { CasoUsoAbrirOrdemServico } from './aplicacao/abrir-ordem-servico.caso-uso';
import { CasoUsoExecutarAcaoOrdemServico } from './aplicacao/executar-acao-ordem-servico.caso-uso';
import { CasoUsoListarOrdensServico } from './aplicacao/listar-ordens-servico.caso-uso';
import { CasoUsoObterOrdemServico } from './aplicacao/obter-ordem-servico.caso-uso';
import {
  REPOSITORIO_ORDEM_SERVICO,
  RepositorioOrdemServico,
} from './aplicacao/ordem-servico.repositorio';
import { RepositorioPrismaOrdemServico } from './infraestrutura/prisma-ordem-servico.repositorio';
import { ControladorOrdemServico } from './apresentacao/ordem-servico.controller';
import {
  REPOSITORIO_COMPOSICAO_ORDEM_SERVICO,
  RepositorioComposicaoOrdemServico,
} from './aplicacao/composicao-ordem-servico.repositorio';
import { CasoUsoDefinirComposicaoOrdemServico } from './aplicacao/definir-composicao-ordem-servico.caso-uso';
import { RepositorioPrismaComposicaoOrdemServico } from './infraestrutura/prisma-composicao-ordem-servico.repositorio';

@Module({
  imports: [
    ModuloClientes,
    ModuloVeiculos,
    ModuloServicos,
    ModuloPecasInsumos,
  ],
  controllers: [ControladorOrdemServico],
  providers: [
    {
      provide: REPOSITORIO_ORDEM_SERVICO,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaOrdemServico(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: REPOSITORIO_COMPOSICAO_ORDEM_SERVICO,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaComposicaoOrdemServico(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoCriarOrdemServico,
      useFactory: (
        ordensServico: RepositorioOrdemServico,
        clientes: RepositorioCliente,
        veiculos: RepositorioVeiculo,
      ) => new CasoUsoCriarOrdemServico(ordensServico, clientes, veiculos),
      inject: [
        REPOSITORIO_ORDEM_SERVICO,
        REPOSITORIO_CLIENTE,
        REPOSITORIO_VEICULO,
      ],
    },
    {
      provide: CasoUsoAbrirOrdemServico,
      useFactory: (
        ordensServico: RepositorioOrdemServico,
        clientes: RepositorioCliente,
        veiculos: RepositorioVeiculo,
      ) => new CasoUsoAbrirOrdemServico(ordensServico, clientes, veiculos),
      inject: [
        REPOSITORIO_ORDEM_SERVICO,
        REPOSITORIO_CLIENTE,
        REPOSITORIO_VEICULO,
      ],
    },
    {
      provide: CasoUsoObterOrdemServico,
      useFactory: (
        ordensServico: RepositorioOrdemServico,
        clientes: RepositorioCliente,
        veiculos: RepositorioVeiculo,
        composicoes: RepositorioComposicaoOrdemServico,
      ) =>
        new CasoUsoObterOrdemServico(
          ordensServico,
          clientes,
          veiculos,
          composicoes,
        ),
      inject: [
        REPOSITORIO_ORDEM_SERVICO,
        REPOSITORIO_CLIENTE,
        REPOSITORIO_VEICULO,
        REPOSITORIO_COMPOSICAO_ORDEM_SERVICO,
      ],
    },
    {
      provide: CasoUsoListarOrdensServico,
      useFactory: (ordensServico: RepositorioOrdemServico) =>
        new CasoUsoListarOrdensServico(ordensServico),
      inject: [REPOSITORIO_ORDEM_SERVICO],
    },
    {
      provide: CasoUsoExecutarAcaoOrdemServico,
      useFactory: (ordensServico: RepositorioOrdemServico) =>
        new CasoUsoExecutarAcaoOrdemServico(ordensServico),
      inject: [REPOSITORIO_ORDEM_SERVICO],
    },
    {
      provide: CasoUsoDefinirComposicaoOrdemServico,
      useFactory: (
        ordensServico: RepositorioOrdemServico,
        composicoes: RepositorioComposicaoOrdemServico,
        servicos: RepositorioServico,
        pecasInsumos: RepositorioPecaInsumo,
      ) =>
        new CasoUsoDefinirComposicaoOrdemServico(
          ordensServico,
          composicoes,
          servicos,
          pecasInsumos,
        ),
      inject: [
        REPOSITORIO_ORDEM_SERVICO,
        REPOSITORIO_COMPOSICAO_ORDEM_SERVICO,
        REPOSITORIO_SERVICO,
        REPOSITORIO_PECA_INSUMO,
      ],
    },
  ],
})
export class ModuloOrdensServico {}
