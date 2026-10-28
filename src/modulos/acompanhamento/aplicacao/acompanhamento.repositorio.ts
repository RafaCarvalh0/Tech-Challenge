import { SituacaoOrcamento } from "../../ordens-servico/dominio/situacao-orcamento";
import { StatusOrdemServico } from "../../ordens-servico/dominio/status-ordem-servico";

export const REPOSITORIO_ACOMPANHAMENTO = Symbol("REPOSITORIO_ACOMPANHAMENTO");

export interface AcompanhamentoOrdemServico {
  identificador: string;
  descricao: string;
  status: StatusOrdemServico;
  atualizadoEm: Date;
  composicao: {
    servicos: Array<{
      nome: string;
      quantidade: number;
      precoUnitarioEmCentavos: number;
      subtotalEmCentavos: number;
    }>;
    pecasInsumos: Array<{
      codigo: string;
      nome: string;
      quantidade: number;
      precoUnitarioEmCentavos: number;
      subtotalEmCentavos: number;
    }>;
  } | null;
  orcamento: {
    totalEmCentavos: number;
    situacao: SituacaoOrcamento;
    geradoEm: Date;
    decididoEm: Date | null;
  } | null;
}

export interface RepositorioAcompanhamento {
  buscar(
    identificador: string,
    codigoAcompanhamento: string,
  ): Promise<AcompanhamentoOrdemServico | null>;
}
