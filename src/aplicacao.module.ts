import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ModuloBancoDados } from './banco-dados/banco-dados.module';
import { ControladorSaude } from './saude/saude.controller';
import { ModuloClientes } from './modulos/clientes/clientes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloBancoDados,
    ModuloClientes,
  ],
  controllers: [ControladorSaude],
})
export class ModuloAplicacao {}
