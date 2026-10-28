import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
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
    if (
      acao === AcaoOrdemServico.SOLICITAR_APROVACAO ||
      acao === AcaoOrdemServico.APROVAR ||
      acao === AcaoOrdemServico.REJEITAR
    ) {
      throw new ErroValidacao(
        'Use o fluxo de orçamento para solicitar ou decidir a aprovação',
      );
    }

    const ordemServicoAtualizada = ordemServico.executarAcao(acao);
    await this.ordensServico.atualizarStatus(ordemServicoAtualizada);
    return paraSaidaOrdemServico(ordemServicoAtualizada);
  }
}
