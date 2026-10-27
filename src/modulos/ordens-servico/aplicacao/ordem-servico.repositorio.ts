import { OrdemServico } from '../dominio/ordem-servico';

export const REPOSITORIO_ORDEM_SERVICO = Symbol('REPOSITORIO_ORDEM_SERVICO');

export interface RepositorioOrdemServico {
  buscarPorId(identificador: string): Promise<OrdemServico | null>;
  salvar(ordemServico: OrdemServico): Promise<void>;
}
