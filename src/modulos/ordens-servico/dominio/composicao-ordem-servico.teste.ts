import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { PecaInsumo } from '../../pecas-insumos/dominio/peca-insumo';
import { Servico } from '../../servicos/dominio/servico';
import { ComposicaoOrdemServico } from './composicao-ordem-servico';

describe('Composição da ordem de serviço', () => {
  it('calcula subtotais e total usando quantidade e preço congelado', () => {
    const servico = Servico.criar({
      nome: 'Balanceamento',
      precoEmCentavos: 8000,
    });
    const pecaInsumo = PecaInsumo.criar({
      codigo: 'PASTILHA',
      nome: 'Pastilha',
      precoUnitarioEmCentavos: 12000,
      quantidadeEstoque: 5,
    });

    const composicao = ComposicaoOrdemServico.criar({
      ordemServicoId: 'ordem-1',
      servicos: [{ servico, quantidade: 2 }],
      pecasInsumos: [{ pecaInsumo, quantidade: 2 }],
    });

    expect(composicao.subtotalServicosEmCentavos).toBe(16000);
    expect(composicao.subtotalPecasInsumosEmCentavos).toBe(24000);
    expect(composicao.totalEmCentavos).toBe(40000);
  });

  it('rejeita itens repetidos e quantidades inválidas', () => {
    const servico = Servico.criar({
      nome: 'Balanceamento',
      precoEmCentavos: 8000,
    });

    expect(() =>
      ComposicaoOrdemServico.criar({
        ordemServicoId: 'ordem-1',
        servicos: [
          { servico, quantidade: 1 },
          { servico, quantidade: 1 },
        ],
        pecasInsumos: [],
      }),
    ).toThrow(ErroValidacao);

    expect(() =>
      ComposicaoOrdemServico.criar({
        ordemServicoId: 'ordem-1',
        servicos: [{ servico, quantidade: 0 }],
        pecasInsumos: [],
      }),
    ).toThrow(ErroValidacao);
  });
});
