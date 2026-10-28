import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { AcaoOrdemServico } from '../dominio/acao-ordem-servico';
import { SaidaOrdemServico, paraSaidaOrdemServico } from './ordem-servico.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export class CasoUsoExecutarAcaoOrdemServico {
  constructor(private readonly ordensServico: RepositorioOrdemServico) {}

  async executar(
    identificador: string,
    acao: AcaoOrdemServico,
  ): Promise<SaidaOrdemServico> {
    const ordemServico = await this.ordensServico.buscarPorId(identificador);
    if (!ordemServico) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }

    const ordemServicoAtualizada = ordemServico.executarAcao(acao);
    await this.ordensServico.atualizarStatus(ordemServicoAtualizada);
    return paraSaidaOrdemServico(ordemServicoAtualizada);
  }
}
