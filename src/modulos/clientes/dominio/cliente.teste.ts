import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { Cliente } from './cliente';

describe('Cliente', () => {
  it('rejeita nome contendo apenas espaços', () => {
    expect(() =>
      Cliente.criar({ nome: '   ', cpfCnpj: '52998224725' }),
    ).toThrow(ErroValidacao);
  });

  it('preserva o CPF/CNPJ ao atualizar somente o nome', () => {
    const cliente = Cliente.restaurar({
      identificador: 'cliente-1',
      nome: 'Maria',
      cpfCnpj: '52998224725',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });

    const atualizado = cliente.atualizar({ nome: 'Maria Silva' });

    expect(atualizado.nome).toBe('Maria Silva');
    expect(atualizado.cpfCnpj.valor).toBe('52998224725');
  });
});
