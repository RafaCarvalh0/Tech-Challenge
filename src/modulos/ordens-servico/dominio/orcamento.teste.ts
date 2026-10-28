import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { Servico } from '../../servicos/dominio/servico';
import { ComposicaoOrdemServico } from './composicao-ordem-servico';
import { Orcamento } from './orcamento';
import { SituacaoOrcamento } from './situacao-orcamento';

describe('Orçamento', () => {
  it('congela os totais calculados pela composição', () => {
    const servico = Servico.criar({
      nome: 'Revisão',
      precoEmCentavos: 12500,
    });
    const composicao = ComposicaoOrdemServico.criar({
      ordemServicoId: 'ordem-1',
      servicos: [{ servico, quantidade: 2 }],
      pecasInsumos: [],
    });

    const orcamento = Orcamento.criar(composicao);

    expect(orcamento).toMatchObject({
      subtotalServicosEmCentavos: 25000,
      subtotalPecasInsumosEmCentavos: 0,
      totalEmCentavos: 25000,
      situacao: SituacaoOrcamento.PENDENTE,
    });
  });

  it('rejeita orçamento sem itens', () => {
    const composicao = ComposicaoOrdemServico.restaurar({
      ordemServicoId: 'ordem-1',
      servicos: [],
      pecasInsumos: [],
    });

    expect(() => Orcamento.criar(composicao)).toThrow(ErroValidacao);
  });
});
