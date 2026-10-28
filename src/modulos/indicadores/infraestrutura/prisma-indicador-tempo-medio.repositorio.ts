import { ServicoPrisma } from "../../../banco-dados/prisma.servico";
import {
  IndicadorTempoMedioServico,
  RepositorioIndicadorTempoMedio,
} from "../aplicacao/indicador-tempo-medio.repositorio";

export class RepositorioPrismaIndicadorTempoMedio
  implements RepositorioIndicadorTempoMedio
{
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  obterPorServico(): Promise<IndicadorTempoMedioServico[]> {
    return this.servicoPrisma.$queryRaw<IndicadorTempoMedioServico[]>`
      SELECT
        item.servico_id AS "servicoId",
        servico.nome AS "nome",
        COUNT(DISTINCT item.ordem_servico_id)::int AS "quantidadeOrdens",
        ROUND(
          AVG(EXTRACT(EPOCH FROM (ordem.finalizado_em - ordem.inicio_execucao_em)))
        )::int AS "tempoMedioExecucaoEmSegundos"
      FROM itens_servicos_ordem item
      INNER JOIN ordens_servico ordem
        ON ordem.identificador = item.ordem_servico_id
      INNER JOIN servicos servico
        ON servico.identificador = item.servico_id
      WHERE ordem.inicio_execucao_em IS NOT NULL
        AND ordem.finalizado_em IS NOT NULL
        AND ordem.status IN ('FINALIZADA', 'ENTREGUE')
      GROUP BY item.servico_id, servico.nome
      ORDER BY servico.nome ASC
    `;
  }
}
