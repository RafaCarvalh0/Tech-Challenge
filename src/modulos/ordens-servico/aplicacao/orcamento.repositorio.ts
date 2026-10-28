import { Orcamento } from '../dominio/orcamento';
import { OrdemServico } from '../dominio/ordem-servico';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';

export const REPOSITORIO_ORCAMENTO = Symbol('REPOSITORIO_ORCAMENTO');

export interface RepositorioOrcamento {
  buscarPorOrdemServicoId(ordemServicoId: string): Promise<Orcamento | null>;
  enviar(orcamento: Orcamento, ordemServico: OrdemServico): Promise<void>;
  decidir(
    orcamento: Orcamento,
    ordemServico: OrdemServico,
    composicao: ComposicaoOrdemServico,
  ): Promise<void>;
}
