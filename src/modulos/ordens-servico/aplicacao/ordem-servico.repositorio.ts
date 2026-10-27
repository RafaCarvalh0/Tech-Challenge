import { OrdemServico } from '../dominio/ordem-servico';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';

export const REPOSITORIO_ORDEM_SERVICO = Symbol('REPOSITORIO_ORDEM_SERVICO');

export interface FiltrosOrdemServico {
  clienteId?: string;
  veiculoId?: string;
  status?: StatusOrdemServico;
}

export interface RepositorioOrdemServico {
  buscarPorId(identificador: string): Promise<OrdemServico | null>;
  listar(filtros: FiltrosOrdemServico): Promise<OrdemServico[]>;
  salvar(ordemServico: OrdemServico): Promise<void>;
  atualizarStatus(ordemServico: OrdemServico): Promise<void>;
}
