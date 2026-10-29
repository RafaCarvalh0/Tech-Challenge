import { Module } from "@nestjs/common";

import { ServicoPrisma } from "../../banco-dados/prisma.servico";
import { CasoUsoDecidirOrcamento } from "../ordens-servico/aplicacao/decidir-orcamento.caso-uso";
import { ModuloOrdensServico } from "../ordens-servico/ordens-servico.module";
import {
  REPOSITORIO_ACOMPANHAMENTO,
  RepositorioAcompanhamento,
} from "./aplicacao/acompanhamento.repositorio";
import { CasoUsoConsultarAcompanhamento } from "./aplicacao/consultar-acompanhamento.caso-uso";
import { CasoUsoDecidirOrcamentoAcompanhamento } from "./aplicacao/decidir-orcamento-acompanhamento.caso-uso";
import { ControladorAcompanhamento } from "./apresentacao/acompanhamento.controller";
import { RepositorioPrismaAcompanhamento } from "./infraestrutura/prisma-acompanhamento.repositorio";

@Module({
  imports: [ModuloOrdensServico],
  controllers: [ControladorAcompanhamento],
  providers: [
    {
      provide: REPOSITORIO_ACOMPANHAMENTO,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaAcompanhamento(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoConsultarAcompanhamento,
      useFactory: (acompanhamentos: RepositorioAcompanhamento) =>
        new CasoUsoConsultarAcompanhamento(acompanhamentos),
      inject: [REPOSITORIO_ACOMPANHAMENTO],
    },
    {
      provide: CasoUsoDecidirOrcamentoAcompanhamento,
      useFactory: (
        consultarAcompanhamento: CasoUsoConsultarAcompanhamento,
        decidirOrcamento: CasoUsoDecidirOrcamento,
      ) =>
        new CasoUsoDecidirOrcamentoAcompanhamento(
          consultarAcompanhamento,
          decidirOrcamento,
        ),
      inject: [CasoUsoConsultarAcompanhamento, CasoUsoDecidirOrcamento],
    },
  ],
})
export class ModuloAcompanhamento {}
