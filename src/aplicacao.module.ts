import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ModuloBancoDados } from './banco-dados/banco-dados.module';
import { ControladorSaude } from './saude/saude.controller';
import { ModuloClientes } from './modulos/clientes/clientes.module';
import { ModuloVeiculos } from './modulos/veiculos/veiculos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloBancoDados,
    ModuloClientes,
    ModuloVeiculos,
  ],
  controllers: [ControladorSaude],
})
export class ModuloAplicacao {}
