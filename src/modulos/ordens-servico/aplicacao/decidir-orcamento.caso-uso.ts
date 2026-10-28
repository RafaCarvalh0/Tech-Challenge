import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { AcaoOrdemServico } from '../dominio/acao-ordem-servico';
import { DecisaoOrcamento } from '../dominio/decisao-orcamento';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { RepositorioComposicaoOrdemServico } from './composicao-ordem-servico.repositorio';
import { RepositorioOrcamento } from './orcamento.repositorio';
import { SaidaOrcamento, paraSaidaOrcamento } from './orcamento.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';
import {
  SaidaOrdemServico,
  paraSaidaOrdemServico,
} from './ordem-servico.saida';

export interface SaidaDecisaoOrcamento {
  ordemServico: SaidaOrdemServico;
  orcamento: SaidaOrcamento;
}

export class CasoUsoDecidirOrcamento {
  constructor(
    private readonly ordensServico: RepositorioOrdemServico,
    private readonly composicoes: RepositorioComposicaoOrdemServico,
    private readonly orcamentos: RepositorioOrcamento,
  ) {}

  async executar(
    ordemServicoId: string,
    decisao: DecisaoOrcamento,
  ): Promise<SaidaDecisaoOrcamento> {
    const [ordemServico, composicao, orcamento] = await Promise.all([
      this.ordensServico.buscarPorId(ordemServicoId),
      this.composicoes.buscarPorOrdemServicoId(ordemServicoId),
      this.orcamentos.buscarPorOrdemServicoId(ordemServicoId),
    ]);
    if (!ordemServico) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }
    if (!composicao || !orcamento) {
      throw new ErroNaoEncontrado('Orçamento da ordem de serviço não encontrado');
    }
    if (ordemServico.status !== StatusOrdemServico.AGUARDANDO_APROVACAO) {
      throw new ErroValidacao(
        'A ordem de serviço não está aguardando aprovação',
      );
    }

    const acao =
      decisao === DecisaoOrcamento.APROVAR
        ? AcaoOrdemServico.APROVAR
        : AcaoOrdemServico.REJEITAR;
    const orcamentoAtualizado = orcamento.decidir(decisao);
    const ordemAtualizada = ordemServico.executarAcao(acao);
    await this.orcamentos.decidir(
      orcamentoAtualizado,
      ordemAtualizada,
      composicao,
    );

    return {
      ordemServico: paraSaidaOrdemServico(ordemAtualizada),
      orcamento: paraSaidaOrcamento(orcamentoAtualizado),
    };
  }
}
