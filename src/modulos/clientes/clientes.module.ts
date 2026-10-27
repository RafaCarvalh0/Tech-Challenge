import { Module } from '@nestjs/common';

import { ServicoPrisma } from '../../banco-dados/prisma.servico';
import { CasoUsoCriarCliente } from './aplicacao/criar-cliente.caso-uso';
import { CasoUsoAtualizarCliente } from './aplicacao/atualizar-cliente.caso-uso';
import { CasoUsoExcluirCliente } from './aplicacao/excluir-cliente.caso-uso';
import { CasoUsoListarClientes } from './aplicacao/listar-clientes.caso-uso';
import {
  REPOSITORIO_CLIENTE,
  RepositorioCliente,
} from './aplicacao/cliente.repositorio';
import { CasoUsoObterCliente } from './aplicacao/obter-cliente.caso-uso';
import { RepositorioPrismaCliente } from './infraestrutura/prisma-cliente.repositorio';
import { ControladorCliente } from './apresentacao/cliente.controller';

@Module({
  controllers: [ControladorCliente],
  providers: [
    {
      provide: REPOSITORIO_CLIENTE,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaCliente(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoCriarCliente,
      useFactory: (repositorio: RepositorioCliente) =>
        new CasoUsoCriarCliente(repositorio),
      inject: [REPOSITORIO_CLIENTE],
    },
    {
      provide: CasoUsoObterCliente,
      useFactory: (repositorio: RepositorioCliente) =>
        new CasoUsoObterCliente(repositorio),
      inject: [REPOSITORIO_CLIENTE],
    },
    {
      provide: CasoUsoListarClientes,
      useFactory: (repositorio: RepositorioCliente) =>
        new CasoUsoListarClientes(repositorio),
      inject: [REPOSITORIO_CLIENTE],
    },
    {
      provide: CasoUsoAtualizarCliente,
      useFactory: (repositorio: RepositorioCliente) =>
        new CasoUsoAtualizarCliente(repositorio),
      inject: [REPOSITORIO_CLIENTE],
    },
    {
      provide: CasoUsoExcluirCliente,
      useFactory: (repositorio: RepositorioCliente) =>
        new CasoUsoExcluirCliente(repositorio),
      inject: [REPOSITORIO_CLIENTE],
    },
  ],
  exports: [REPOSITORIO_CLIENTE],
})
export class ModuloClientes {}
