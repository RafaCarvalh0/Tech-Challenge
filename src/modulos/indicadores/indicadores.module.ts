import { Module } from "@nestjs/common";

import { ServicoPrisma } from "../../banco-dados/prisma.servico";
import {
  REPOSITORIO_INDICADOR_TEMPO_MEDIO,
  RepositorioIndicadorTempoMedio,
} from "./aplicacao/indicador-tempo-medio.repositorio";
import { CasoUsoObterTempoMedioServicos } from "./aplicacao/obter-tempo-medio-servicos.caso-uso";
import { ControladorIndicador } from "./apresentacao/indicador.controller";
import { RepositorioPrismaIndicadorTempoMedio } from "./infraestrutura/prisma-indicador-tempo-medio.repositorio";

@Module({
  controllers: [ControladorIndicador],
  providers: [
    {
      provide: REPOSITORIO_INDICADOR_TEMPO_MEDIO,
      useFactory: (servicoPrisma: ServicoPrisma) =>
        new RepositorioPrismaIndicadorTempoMedio(servicoPrisma),
      inject: [ServicoPrisma],
    },
    {
      provide: CasoUsoObterTempoMedioServicos,
      useFactory: (repositorio: RepositorioIndicadorTempoMedio) =>
        new CasoUsoObterTempoMedioServicos(repositorio),
      inject: [REPOSITORIO_INDICADOR_TEMPO_MEDIO],
    },
  ],
})
export class ModuloIndicadores {}
