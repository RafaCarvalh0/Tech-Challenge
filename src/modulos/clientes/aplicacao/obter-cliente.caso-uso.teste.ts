import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { Cliente } from '../dominio/cliente';
import { RepositorioCliente } from './cliente.repositorio';
import { CasoUsoObterCliente } from './obter-cliente.caso-uso';

class RepositorioClienteEmMemoria implements RepositorioCliente {
  constructor(private readonly cliente: Cliente | null) {}

  async buscarPorId(): Promise<Cliente | null> {
    return this.cliente;
  }

  async buscarPorCpfCnpj(): Promise<Cliente | null> {
    return null;
  }

  async listar(): Promise<Cliente[]> {
    return this.cliente ? [this.cliente] : [];
  }

  async salvar(): Promise<void> {}

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

describe('CasoUsoObterCliente', () => {
  it('retorna um cliente existente', async () => {
    const cliente = Cliente.restaurar({
      identificador: 'cliente-identificador',
      nome: 'Maria da Silva',
      cpfCnpj: '52998224725',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });
    const casoUso = new CasoUsoObterCliente(
      new RepositorioClienteEmMemoria(cliente),
    );

    await expect(casoUso.executar('cliente-identificador')).resolves.toEqual({
      identificador: 'cliente-identificador',
      nome: 'Maria da Silva',
      cpfCnpj: '52998224725',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });
  });

  it('rejeita cliente desconhecido', async () => {
    const casoUso = new CasoUsoObterCliente(
      new RepositorioClienteEmMemoria(null),
    );

    await expect(casoUso.executar('ausente')).rejects.toThrow(
      ErroNaoEncontrado,
    );
  });
});
