import { validarUrlBancoDadosTeste } from './seguranca-banco-dados';

describe('Segurança do banco de dados ponta a ponta', () => {
  it('aceita o banco de testes dedicado da oficina', () => {
    expect(() =>
      validarUrlBancoDadosTeste(
        'postgresql://postgres:postgres@localhost:5433/oficina_teste?schema=public',
      ),
    ).not.toThrow();
  });

  it('rejeita o banco normal de desenvolvimento', () => {
    expect(() =>
      validarUrlBancoDadosTeste(
        'postgresql://postgres:postgres@localhost:5432/oficina?schema=public',
      ),
    ).toThrow(
      'Testes ponta a ponta exigem um banco dedicado terminado em _teste',
    );
  });
});
