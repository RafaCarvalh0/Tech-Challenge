import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { SaidaOrdemServico, paraSaidaOrdemServico } from './ordem-servico.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export class CasoUsoObterOrdemServico {
  constructor(private readonly ordensServico: RepositorioOrdemServico) {}

  async executar(identificador: string): Promise<SaidaOrdemServico> {
    const ordemServico = await this.ordensServico.buscarPorId(identificador);
    if (!ordemServico) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }

    return paraSaidaOrdemServico(ordemServico);
  }
}
