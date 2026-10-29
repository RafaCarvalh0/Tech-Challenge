import { DecisaoOrcamento } from '../dominio/decisao-orcamento';
import { Orcamento } from '../dominio/orcamento';
import { OrdemServico } from '../dominio/ordem-servico';
import { SituacaoOrcamento } from '../dominio/situacao-orcamento';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { CasoUsoDecidirOrcamento } from './decidir-orcamento.caso-uso';
import { RepositorioOrcamento } from './orcamento.repositorio';

const instante = new Date('2026-10-28T12:00:00.000Z');

class RepositorioOrcamentoFalso implements RepositorioOrcamento {
  decisaoRecebida: DecisaoOrcamento | null = null;

  async buscarPorOrdemServicoId(): Promise<Orcamento | null> {
    return null;
  }

  async enviar(): Promise<Orcamento> {
    throw new Error('não usado neste teste');
  }

  async decidir(
    ordemServicoId: string,
    decisao: DecisaoOrcamento,
  ): Promise<{ orcamento: Orcamento; ordemServico: OrdemServico }> {
    this.decisaoRecebida = decisao;
    const orcamento = Orcamento.restaurar({
      identificador: 'orcamento-1',
      ordemServicoId,
      subtotalServicosEmCentavos: 12000,
      subtotalPecasInsumosEmCentavos: 3500,
      totalEmCentavos: 15500,
      situacao: SituacaoOrcamento.APROVADO,
      geradoEm: instante,
      atualizadoEm: instante,
      decididoEm: instante,
    });
    const ordemServico = OrdemServico.restaurar({
      identificador: ordemServicoId,
      clienteId: 'cliente-1',
      veiculoId: 'veiculo-1',
      descricao: 'Revisão preventiva',
      codigoAcompanhamento: 'codigo-privado',
      status: StatusOrdemServico.EM_EXECUCAO,
      inicioExecucaoEm: instante,
      criadoEm: instante,
      atualizadoEm: instante,
    });
    return { orcamento, ordemServico };
  }
}

describe('CasoUsoDecidirOrcamento', () => {
  it('encaminha a aprovação e retorna orçamento e OS atualizados', async () => {
    const repositorio = new RepositorioOrcamentoFalso();
    const casoUso = new CasoUsoDecidirOrcamento(repositorio);

    await expect(
      casoUso.executar('ordem-1', DecisaoOrcamento.APROVAR),
    ).resolves.toMatchObject({
      ordemServico: {
        identificador: 'ordem-1',
        status: StatusOrdemServico.EM_EXECUCAO,
        inicioExecucaoEm: instante,
      },
      orcamento: {
        identificador: 'orcamento-1',
        ordemServicoId: 'ordem-1',
        totalEmCentavos: 15500,
        situacao: SituacaoOrcamento.APROVADO,
        decididoEm: instante,
      },
    });
    expect(repositorio.decisaoRecebida).toBe(DecisaoOrcamento.APROVAR);
  });
});
