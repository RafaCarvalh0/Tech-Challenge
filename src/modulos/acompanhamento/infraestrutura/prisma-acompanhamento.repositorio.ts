import { ServicoPrisma } from "../../../banco-dados/prisma.servico";
import {
  AcompanhamentoOrdemServico,
  RepositorioAcompanhamento,
} from "../aplicacao/acompanhamento.repositorio";
import { SituacaoOrcamento } from "../../ordens-servico/dominio/situacao-orcamento";
import { StatusOrdemServico } from "../../ordens-servico/dominio/status-ordem-servico";

export class RepositorioPrismaAcompanhamento
  implements RepositorioAcompanhamento
{
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscar(
    identificador: string,
    codigoAcompanhamento: string,
  ): Promise<AcompanhamentoOrdemServico | null> {
    const registro = await this.servicoPrisma.ordemServico.findFirst({
      where: { identificador, codigoAcompanhamento },
      include: {
        itensServico: { orderBy: { nome: "asc" } },
        itensPecaInsumo: { orderBy: { nome: "asc" } },
        orcamento: true,
      },
    });
    if (!registro) {
      return null;
    }

    const possuiComposicao =
      registro.itensServico.length > 0 || registro.itensPecaInsumo.length > 0;
    return {
      identificador: registro.identificador,
      descricao: registro.descricao,
      status: registro.status as StatusOrdemServico,
      atualizadoEm: registro.atualizadoEm,
      composicao: possuiComposicao
        ? {
            servicos: registro.itensServico.map((item) => ({
              nome: item.nome,
              quantidade: item.quantidade,
              precoUnitarioEmCentavos: item.precoUnitarioEmCentavos,
              subtotalEmCentavos:
                item.quantidade * item.precoUnitarioEmCentavos,
            })),
            pecasInsumos: registro.itensPecaInsumo.map((item) => ({
              codigo: item.codigo,
              nome: item.nome,
              quantidade: item.quantidade,
              precoUnitarioEmCentavos: item.precoUnitarioEmCentavos,
              subtotalEmCentavos:
                item.quantidade * item.precoUnitarioEmCentavos,
            })),
          }
        : null,
      orcamento: registro.orcamento
        ? {
            totalEmCentavos: registro.orcamento.totalEmCentavos,
            situacao: registro.orcamento.situacao as SituacaoOrcamento,
            geradoEm: registro.orcamento.geradoEm,
            decididoEm: registro.orcamento.decididoEm,
          }
        : null,
    };
  }
}
