import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { AcaoOrdemServico } from '../dominio/acao-ordem-servico';
import { Orcamento } from '../dominio/orcamento';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { RepositorioComposicaoOrdemServico } from './composicao-ordem-servico.repositorio';
import { RepositorioOrcamento } from './orcamento.repositorio';
import { SaidaOrcamento, paraSaidaOrcamento } from './orcamento.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export class CasoUsoGerarOrcamento {
  constructor(
    private readonly ordensServico: RepositorioOrdemServico,
    private readonly composicoes: RepositorioComposicaoOrdemServico,
    private readonly orcamentos: RepositorioOrcamento,
  ) {}

  async executar(ordemServicoId: string): Promise<SaidaOrcamento> {
    const ordemServico = await this.ordensServico.buscarPorId(ordemServicoId);
    if (!ordemServico) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }
    if (ordemServico.status !== StatusOrdemServico.EM_DIAGNOSTICO) {
      throw new ErroValidacao(
        'O orçamento só pode ser enviado durante o diagnóstico',
      );
    }

    const composicao = await this.composicoes.buscarPorOrdemServicoId(
      ordemServicoId,
    );
    if (!composicao) {
      throw new ErroValidacao(
        'Defina a composição antes de enviar o orçamento',
      );
    }

    const orcamento = Orcamento.criar(composicao);
    const ordemAtualizada = ordemServico.executarAcao(
      AcaoOrdemServico.SOLICITAR_APROVACAO,
    );
    await this.orcamentos.enviar(orcamento, ordemAtualizada);
    return paraSaidaOrcamento(orcamento);
  }
}
