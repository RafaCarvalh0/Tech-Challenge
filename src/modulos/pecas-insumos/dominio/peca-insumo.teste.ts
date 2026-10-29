import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { PecaInsumo } from './peca-insumo';
import { TipoMovimentacaoEstoque } from './tipo-movimentacao-estoque';

describe('Peça ou insumo', () => {
  it('normaliza código e dados ao criar', () => {
    const pecaInsumo = PecaInsumo.criar({
      codigo: '  oleo-5w30  ',
      nome: '  Óleo 5W30  ',
      descricao: '  Um litro  ',
      precoUnitarioEmCentavos: 4500,
      quantidadeEstoque: 10,
    });

    expect(pecaInsumo).toMatchObject({
      codigo: 'OLEO-5W30',
      nome: 'Óleo 5W30',
      descricao: 'Um litro',
      precoUnitarioEmCentavos: 4500,
      quantidadeEstoque: 10,
    });
  });

  it('registra entrada e saída de estoque', () => {
    const pecaInsumo = PecaInsumo.criar({
      codigo: 'FILTRO-01',
      nome: 'Filtro',
      precoUnitarioEmCentavos: 3000,
      quantidadeEstoque: 5,
    });

    const comEntrada = pecaInsumo.movimentarEstoque(
      TipoMovimentacaoEstoque.ENTRADA,
      3,
    );
    const comSaida = comEntrada.movimentarEstoque(
      TipoMovimentacaoEstoque.SAIDA,
      2,
    );

    expect(comEntrada.quantidadeEstoque).toBe(8);
    expect(comSaida.quantidadeEstoque).toBe(6);
  });

  it('rejeita saída maior que o estoque disponível', () => {
    const pecaInsumo = PecaInsumo.criar({
      codigo: 'FILTRO-01',
      nome: 'Filtro',
      precoUnitarioEmCentavos: 3000,
      quantidadeEstoque: 1,
    });

    expect(() =>
      pecaInsumo.movimentarEstoque(TipoMovimentacaoEstoque.SAIDA, 2),
    ).toThrow(ErroValidacao);
  });

  it.each([0, 1.5])(
    'rejeita quantidade de movimentação inválida: %s',
    (quantidade) => {
      const pecaInsumo = PecaInsumo.criar({
        codigo: 'FILTRO-01',
        nome: 'Filtro',
        precoUnitarioEmCentavos: 3000,
      });

      expect(() =>
        pecaInsumo.movimentarEstoque(
          TipoMovimentacaoEstoque.ENTRADA,
          quantidade,
        ),
      ).toThrow(ErroValidacao);
    },
  );

  it.each([
    { codigo: '  ', nome: 'Filtro' },
    { codigo: 'FILTRO-01', nome: '  ' },
  ])('rejeita código ou nome vazio', ({ codigo, nome }) => {
    expect(() =>
      PecaInsumo.criar({
        codigo,
        nome,
        precoUnitarioEmCentavos: 3000,
      }),
    ).toThrow(ErroValidacao);
  });

  it.each([-1, 10.5])(
    'rejeita preço unitário inválido: %s',
    (precoUnitarioEmCentavos) => {
      expect(() =>
        PecaInsumo.criar({
          codigo: 'FILTRO-01',
          nome: 'Filtro',
          precoUnitarioEmCentavos,
        }),
      ).toThrow(ErroValidacao);
    },
  );
});
