import { Module } from '@nestjs/common';

import { ServicoPrisma } from '../../banco-dados/prisma.servico';
import {
  REPOSITORIO_CLIENTE,
  RepositorioCliente,
} from '../clientes/aplicacao/cliente.repositorio';
import { ModuloClientes } from '../clientes/clientes.module';
import { CasoUsoCriarVeiculo } from './aplicacao/criar-veiculo.caso-uso';
import { CasoUsoObterVeiculo } from './aplicacao/obter-veiculo.caso-uso';
import {
  REPOSITORIO_VEICULO,
  RepositorioVeiculo,
} from './aplicacao/veiculo.repositorio';
import { RepositorioPrismaVeiculo } from './infraestrutura/prisma-veiculo.repositorio';
import { ControladorVeiculo } from './apresentacao/veiculo.controller';

@Module({
  imports: [ModuloClientes],
  controllers: [ControladorVeiculo],
  providers: [
    {
      provide: REPOSITORIO_VEICULO,
      useFactory: (servicoPrisma: ServicoPrisma) => new RepositorioPrismaVeiculo(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoCriarVeiculo,
      useFactory: (
        veiculos: RepositorioVeiculo,
        clientes: RepositorioCliente,
      ) => new CasoUsoCriarVeiculo(veiculos, clientes),
      inject: [REPOSITORIO_VEICULO, REPOSITORIO_CLIENTE],
    },
    {
      provide: CasoUsoObterVeiculo,
      useFactory: (veiculos: RepositorioVeiculo) =>
        new CasoUsoObterVeiculo(veiculos),
      inject: [REPOSITORIO_VEICULO],
    },
  ],
  exports: [REPOSITORIO_VEICULO],
})
export class ModuloVeiculos {}
