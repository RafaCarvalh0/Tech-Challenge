import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ModuloBancoDados } from './banco-dados/banco-dados.module';
import { ControladorSaude } from './saude/saude.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloBancoDados,
  ],
  controllers: [ControladorSaude],
})
export class ModuloAplicacao {}
