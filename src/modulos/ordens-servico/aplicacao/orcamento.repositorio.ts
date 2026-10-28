import { Orcamento } from '../dominio/orcamento';
import { OrdemServico } from '../dominio/ordem-servico';
import { DecisaoOrcamento } from '../dominio/decisao-orcamento';

export const REPOSITORIO_ORCAMENTO = Symbol('REPOSITORIO_ORCAMENTO');

export interface RepositorioOrcamento {
  buscarPorOrdemServicoId(ordemServicoId: string): Promise<Orcamento | null>;
  enviar(ordemServicoId: string): Promise<Orcamento>;
  decidir(
    ordemServicoId: string,
    decisao: DecisaoOrcamento,
  ): Promise<{ orcamento: Orcamento; ordemServico: OrdemServico }>;
}
