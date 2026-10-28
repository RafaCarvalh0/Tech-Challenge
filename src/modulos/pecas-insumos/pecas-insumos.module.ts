import { Module } from '@nestjs/common';

import { ServicoPrisma } from '../../banco-dados/prisma.servico';
import { CasoUsoAtualizarPecaInsumo } from './aplicacao/atualizar-peca-insumo.caso-uso';
import { CasoUsoCriarPecaInsumo } from './aplicacao/criar-peca-insumo.caso-uso';
import { CasoUsoExcluirPecaInsumo } from './aplicacao/excluir-peca-insumo.caso-uso';
import { CasoUsoListarPecasInsumos } from './aplicacao/listar-pecas-insumos.caso-uso';
import { CasoUsoMovimentarEstoque } from './aplicacao/movimentar-estoque.caso-uso';
import { CasoUsoObterPecaInsumo } from './aplicacao/obter-peca-insumo.caso-uso';
import {
  REPOSITORIO_PECA_INSUMO,
  RepositorioPecaInsumo,
} from './aplicacao/peca-insumo.repositorio';
import { ControladorPecaInsumo } from './apresentacao/peca-insumo.controller';
import { RepositorioPrismaPecaInsumo } from './infraestrutura/prisma-peca-insumo.repositorio';

@Module({
  controllers: [ControladorPecaInsumo],
  providers: [
    {
      provide: REPOSITORIO_PECA_INSUMO,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaPecaInsumo(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoCriarPecaInsumo,
      useFactory: (repositorio: RepositorioPecaInsumo) =>
        new CasoUsoCriarPecaInsumo(repositorio),
      inject: [REPOSITORIO_PECA_INSUMO],
    },
    {
      provide: CasoUsoObterPecaInsumo,
      useFactory: (repositorio: RepositorioPecaInsumo) =>
        new CasoUsoObterPecaInsumo(repositorio),
      inject: [REPOSITORIO_PECA_INSUMO],
    },
    {
      provide: CasoUsoListarPecasInsumos,
      useFactory: (repositorio: RepositorioPecaInsumo) =>
        new CasoUsoListarPecasInsumos(repositorio),
      inject: [REPOSITORIO_PECA_INSUMO],
    },
    {
      provide: CasoUsoAtualizarPecaInsumo,
      useFactory: (repositorio: RepositorioPecaInsumo) =>
        new CasoUsoAtualizarPecaInsumo(repositorio),
      inject: [REPOSITORIO_PECA_INSUMO],
    },
    {
      provide: CasoUsoMovimentarEstoque,
      useFactory: (repositorio: RepositorioPecaInsumo) =>
        new CasoUsoMovimentarEstoque(repositorio),
      inject: [REPOSITORIO_PECA_INSUMO],
    },
    {
      provide: CasoUsoExcluirPecaInsumo,
      useFactory: (repositorio: RepositorioPecaInsumo) =>
        new CasoUsoExcluirPecaInsumo(repositorio),
      inject: [REPOSITORIO_PECA_INSUMO],
    },
  ],
  exports: [REPOSITORIO_PECA_INSUMO],
})
export class ModuloPecasInsumos {}
