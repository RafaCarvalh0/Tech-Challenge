import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ModuloBancoDados } from './banco-dados/banco-dados.module';
import { ControladorSaude } from './saude/saude.controller';
import { ModuloClientes } from './modulos/clientes/clientes.module';
import { ModuloVeiculos } from './modulos/veiculos/veiculos.module';
import { ModuloOrdensServico } from './modulos/ordens-servico/ordens-servico.module';
import { ModuloServicos } from './modulos/servicos/servicos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloBancoDados,
    ModuloClientes,
    ModuloVeiculos,
    ModuloOrdensServico,
    ModuloServicos,
  ],
  controllers: [ControladorSaude],
})
export class ModuloAplicacao {}
