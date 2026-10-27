import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { CpfCnpj } from './cpf-cnpj';

describe('CpfCnpj', () => {
  it.each([
    ['529.982.247-25', '52998224725'],
    ['04.252.011/0001-10', '04252011000110'],
  ])('aceita e normaliza CPF/CNPJ brasileiro válidoentificador', (entrada, esperado) => {
    expect(CpfCnpj.criar(entrada).valor).toBe(esperado);
  });

  it.each(['111.111.111-11', '04.252.011/0001-11', '123']) (
    'rejeita CPF/CNPJ brasileiro inválidoentificador',
    (entrada) => {
      expect(() => CpfCnpj.criar(entrada)).toThrow(ErroValidacao);
    },
  );
});
