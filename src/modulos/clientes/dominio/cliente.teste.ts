import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { Cliente } from './cliente';

describe('Cliente', () => {
  it('rejeita nome contendo apenas espaços', () => {
    expect(() =>
      Cliente.criar({ nome: '   ', cpfCnpj: '52998224725' }),
    ).toThrow(ErroValidacao);
  });
});
