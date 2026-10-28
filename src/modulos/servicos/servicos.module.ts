import { Module } from "@nestjs/common";

import { ServicoPrisma } from "../../banco-dados/prisma.servico";
import { CasoUsoAtualizarServico } from "./aplicacao/atualizar-servico.caso-uso";
import { CasoUsoCriarServico } from "./aplicacao/criar-servico.caso-uso";
import { CasoUsoExcluirServico } from "./aplicacao/excluir-servico.caso-uso";
import { CasoUsoListarServicos } from "./aplicacao/listar-servicos.caso-uso";
import { CasoUsoObterServico } from "./aplicacao/obter-servico.caso-uso";
import {
  REPOSITORIO_SERVICO,
  RepositorioServico,
} from "./aplicacao/servico.repositorio";
import { ControladorServico } from "./apresentacao/servico.controller";
import { RepositorioPrismaServico } from "./infraestrutura/prisma-servico.repositorio";

@Module({
  controllers: [ControladorServico],
  providers: [
    {
      provide: REPOSITORIO_SERVICO,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaServico(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoCriarServico,
      useFactory: (repositorio: RepositorioServico) =>
        new CasoUsoCriarServico(repositorio),
      inject: [REPOSITORIO_SERVICO],
    },
    {
      provide: CasoUsoObterServico,
      useFactory: (repositorio: RepositorioServico) =>
        new CasoUsoObterServico(repositorio),
      inject: [REPOSITORIO_SERVICO],
    },
    {
      provide: CasoUsoListarServicos,
      useFactory: (repositorio: RepositorioServico) =>
        new CasoUsoListarServicos(repositorio),
      inject: [REPOSITORIO_SERVICO],
    },
    {
      provide: CasoUsoAtualizarServico,
      useFactory: (repositorio: RepositorioServico) =>
        new CasoUsoAtualizarServico(repositorio),
      inject: [REPOSITORIO_SERVICO],
    },
    {
      provide: CasoUsoExcluirServico,
      useFactory: (repositorio: RepositorioServico) =>
        new CasoUsoExcluirServico(repositorio),
      inject: [REPOSITORIO_SERVICO],
    },
  ],
  exports: [REPOSITORIO_SERVICO],
})
export class ModuloServicos {}
