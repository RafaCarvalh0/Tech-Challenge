import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ModuloBancoDados } from './banco-dados/banco-dados.module';
import { ControladorSaude } from './saude/saude.controller';
import { ModuloClientes } from './modulos/clientes/clientes.module';
import { ModuloVeiculos } from './modulos/veiculos/veiculos.module';
import { ModuloOrdensServico } from './modulos/ordens-servico/ordens-servico.module';
import { ModuloServicos } from './modulos/servicos/servicos.module';
import { ModuloPecasInsumos } from './modulos/pecas-insumos/pecas-insumos.module';
import { ModuloAutenticacao } from './modulos/autenticacao/autenticacao.module';
import { ModuloAcompanhamento } from './modulos/acompanhamento/acompanhamento.module';
import { ModuloIndicadores } from './modulos/indicadores/indicadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloAutenticacao,
    ModuloAcompanhamento,
    ModuloBancoDados,
    ModuloClientes,
    ModuloVeiculos,
    ModuloOrdensServico,
    ModuloServicos,
    ModuloPecasInsumos,
    ModuloIndicadores,
  ],
  controllers: [ControladorSaude],
})
export class ModuloAplicacao {}
