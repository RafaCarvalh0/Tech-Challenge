import { Module } from "@nestjs/common";

import { ServicoPrisma } from "../../banco-dados/prisma.servico";
import {
  REPOSITORIO_ACOMPANHAMENTO,
  RepositorioAcompanhamento,
} from "./aplicacao/acompanhamento.repositorio";
import { CasoUsoConsultarAcompanhamento } from "./aplicacao/consultar-acompanhamento.caso-uso";
import { ControladorAcompanhamento } from "./apresentacao/acompanhamento.controller";
import { RepositorioPrismaAcompanhamento } from "./infraestrutura/prisma-acompanhamento.repositorio";

@Module({
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
  ],
})
export class ModuloAcompanhamento {}
