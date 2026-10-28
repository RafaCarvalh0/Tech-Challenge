import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { Cliente } from '../dominio/cliente';
import { RepositorioCliente } from './cliente.repositorio';
import { CasoUsoCriarCliente } from './criar-cliente.caso-uso';

class RepositorioClienteEmMemoria implements RepositorioCliente {
  readonly clientes: Cliente[] = [];

  async buscarPorId(identificador: string): Promise<Cliente | null> {
    return (
      this.clientes.find(
        (cliente) => cliente.identificador === identificador,
      ) ?? null
    );
  }

  async buscarPorCpfCnpj(cpfCnpj: string): Promise<Cliente | null> {
    return (
      this.clientes.find((cliente) => cliente.cpfCnpj.valor === cpfCnpj) ?? null
    );
  }

  async listar(): Promise<Cliente[]> {
    return this.clientes;
  }

  async salvar(cliente: Cliente): Promise<void> {
    this.clientes.push(cliente);
  }

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

describe('CasoUsoCriarCliente', () => {
  it('cria cliente com CPF/CNPJ normalizadoentificador', async () => {
    const repositorio = new RepositorioClienteEmMemoria();
    const casoUso = new CasoUsoCriarCliente(repositorio);

    const cliente = await casoUso.executar({
      nome: 'Maria da Silva',
      cpfCnpj: '529.982.247-25',
    });

    expect(cliente.nome).toBe('Maria da Silva');
    expect(cliente.cpfCnpj).toBe('52998224725');
    expect(repositorio.clientes).toHaveLength(1);
  });

  it('rejeita CPF/CNPJ duplicadoentificador', async () => {
    const repositorio = new RepositorioClienteEmMemoria();
    const casoUso = new CasoUsoCriarCliente(repositorio);
    const entrada = { nome: 'Maria da Silva', cpfCnpj: '52998224725' };

    await casoUso.executar(entrada);

    await expect(casoUso.executar(entrada)).rejects.toThrow(ErroConflito);
  });
});
