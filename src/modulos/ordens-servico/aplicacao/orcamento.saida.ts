import { Orcamento } from '../dominio/orcamento';
import { SituacaoOrcamento } from '../dominio/situacao-orcamento';

export interface SaidaOrcamento {
  identificador: string;
  ordemServicoId: string;
  subtotalServicosEmCentavos: number;
  subtotalPecasInsumosEmCentavos: number;
  totalEmCentavos: number;
  situacao: SituacaoOrcamento;
  geradoEm: Date;
  atualizadoEm: Date;
  decididoEm: Date | null;
}

export function paraSaidaOrcamento(orcamento: Orcamento): SaidaOrcamento {
  return {
    identificador: orcamento.identificador,
    ordemServicoId: orcamento.ordemServicoId,
    subtotalServicosEmCentavos: orcamento.subtotalServicosEmCentavos,
    subtotalPecasInsumosEmCentavos:
      orcamento.subtotalPecasInsumosEmCentavos,
    totalEmCentavos: orcamento.totalEmCentavos,
    situacao: orcamento.situacao,
    geradoEm: orcamento.geradoEm,
    atualizadoEm: orcamento.atualizadoEm,
    decididoEm: orcamento.decididoEm,
  };
}
