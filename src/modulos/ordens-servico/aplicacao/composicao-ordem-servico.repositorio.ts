import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';

export const REPOSITORIO_COMPOSICAO_ORDEM_SERVICO = Symbol(
  'REPOSITORIO_COMPOSICAO_ORDEM_SERVICO',
);

export interface RepositorioComposicaoOrdemServico {
  buscarPorOrdemServicoId(
    ordemServicoId: string,
  ): Promise<ComposicaoOrdemServico | null>;
  substituir(composicao: ComposicaoOrdemServico): Promise<void>;
}
