import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';

export interface SaidaComposicaoOrdemServico {
  ordemServicoId: string;
  servicos: Array<{
    servicoId: string;
    nome: string;
    precoUnitarioEmCentavos: number;
    quantidade: number;
    subtotalEmCentavos: number;
  }>;
  pecasInsumos: Array<{
    pecaInsumoId: string;
    codigo: string;
    nome: string;
    precoUnitarioEmCentavos: number;
    quantidade: number;
    subtotalEmCentavos: number;
  }>;
  subtotalServicosEmCentavos: number;
  subtotalPecasInsumosEmCentavos: number;
  totalEmCentavos: number;
}

export function paraSaidaComposicaoOrdemServico(
  composicao: ComposicaoOrdemServico,
): SaidaComposicaoOrdemServico {
  return {
    ordemServicoId: composicao.ordemServicoId,
    servicos: composicao.servicos.map((item) => ({
      ...item,
      subtotalEmCentavos:
        item.precoUnitarioEmCentavos * item.quantidade,
    })),
    pecasInsumos: composicao.pecasInsumos.map((item) => ({
      ...item,
      subtotalEmCentavos:
        item.precoUnitarioEmCentavos * item.quantidade,
    })),
    subtotalServicosEmCentavos: composicao.subtotalServicosEmCentavos,
    subtotalPecasInsumosEmCentavos:
      composicao.subtotalPecasInsumosEmCentavos,
    totalEmCentavos: composicao.totalEmCentavos,
  };
}
