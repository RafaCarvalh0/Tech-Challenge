import { Orcamento } from '../dominio/orcamento';
import { OrdemServico } from '../dominio/ordem-servico';
import { SituacaoOrcamento } from '../dominio/situacao-orcamento';
import { CasoUsoGerarOrcamento } from './gerar-orcamento.caso-uso';
import { RepositorioOrcamento } from './orcamento.repositorio';

const instante = new Date('2026-10-28T12:00:00.000Z');

class RepositorioOrcamentoFalso implements RepositorioOrcamento {
  async buscarPorOrdemServicoId(): Promise<Orcamento | null> {
    return null;
  }

  async enviar(): Promise<Orcamento> {
    return Orcamento.restaurar({
      identificador: 'orcamento-1',
      ordemServicoId: 'ordem-1',
      subtotalServicosEmCentavos: 12000,
      subtotalPecasInsumosEmCentavos: 3500,
      totalEmCentavos: 15500,
      situacao: SituacaoOrcamento.PENDENTE,
      geradoEm: instante,
      atualizadoEm: instante,
      decididoEm: null,
    });
  }

  async decidir(): Promise<{
    orcamento: Orcamento;
    ordemServico: OrdemServico;
  }> {
    throw new Error('não usado neste teste');
  }
}

describe('CasoUsoGerarOrcamento', () => {
  it('retorna o orçamento enviado com totais e situação pendente', async () => {
    const casoUso = new CasoUsoGerarOrcamento(
      new RepositorioOrcamentoFalso(),
    );

    await expect(casoUso.executar('ordem-1')).resolves.toEqual({
      identificador: 'orcamento-1',
      ordemServicoId: 'ordem-1',
      subtotalServicosEmCentavos: 12000,
      subtotalPecasInsumosEmCentavos: 3500,
      totalEmCentavos: 15500,
      situacao: SituacaoOrcamento.PENDENTE,
      geradoEm: instante,
      atualizadoEm: instante,
      decididoEm: null,
    });
  });
});
