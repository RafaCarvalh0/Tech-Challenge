import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { Veiculo } from './veiculo';

describe('Veiculo', () => {
  it('rejeita ano de fabricação anterior à existência do automóvel', () => {
    expect(() =>
      Veiculo.criar({
        clienteId: 'cliente-identificador',
        placa: 'ABC1D23',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 1800,
      }),
    ).toThrow(ErroValidacao);
  });

  it.each([
    { marca: '  ', modelo: 'Civic' },
    { marca: 'Honda', modelo: '  ' },
  ])(
    'rejeita marca ou modelo vazio após remover espaços',
    ({ marca, modelo }) => {
      expect(() =>
        Veiculo.criar({
          clienteId: 'cliente-identificador',
          placa: 'ABC1D23',
          marca,
          modelo,
          ano: 2022,
        }),
      ).toThrow(ErroValidacao);
    },
  );

  it('preserva a placa ao atualizar somente a marca', () => {
    const veiculo = Veiculo.restaurar({
      identificador: 'veiculo-1',
      clienteId: 'cliente-1',
      placa: 'ABC1D23',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2022,
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });

    const atualizado = veiculo.atualizar({ marca: 'Toyota' });

    expect(atualizado.placa.valor).toBe('ABC1D23');
    expect(atualizado.marca).toBe('Toyota');
  });
});
