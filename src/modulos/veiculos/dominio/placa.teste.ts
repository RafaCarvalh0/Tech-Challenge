import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { Placa } from './placa';

describe('Placa', () => {
  it.each([
    ['ABC-1234', 'ABC1234'],
    ['abc1d23', 'ABC1D23'],
  ])('aceita e normaliza uma placa brasileira', (entrada, esperado) => {
    expect(Placa.criar(entrada).valor).toBe(esperado);
  });

  it.each(['AB-1234', 'ABC123', 'ABC@1234', '']) (
    'rejeita placa inválida',
    (entrada) => {
      expect(() => Placa.criar(entrada)).toThrow(ErroValidacao);
    },
  );
});
