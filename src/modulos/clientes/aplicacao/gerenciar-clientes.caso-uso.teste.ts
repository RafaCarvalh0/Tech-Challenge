import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { Cliente } from '../dominio/cliente';
import { CasoUsoAtualizarCliente } from './atualizar-cliente.caso-uso';
import { RepositorioCliente } from './cliente.repositorio';
import { CasoUsoExcluirCliente } from './excluir-cliente.caso-uso';
import { CasoUsoListarClientes } from './listar-clientes.caso-uso';

class RepositorioClienteEmMemoria implements RepositorioCliente {
  constructor(readonly clientes: Cliente[] = []) {}

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
    return [...this.clientes].sort((primeiro, segundo) =>
      primeiro.nome.localeCompare(segundo.nome),
    );
  }

  async salvar(cliente: Cliente): Promise<void> {
    this.clientes.push(cliente);
  }

  async atualizar(cliente: Cliente): Promise<void> {
    const indice = this.clientes.findIndex(
      (registro) => registro.identificador === cliente.identificador,
    );
    this.clientes[indice] = cliente;
  }

  async excluir(identificador: string): Promise<void> {
    const indice = this.clientes.findIndex(
      (cliente) => cliente.identificador === identificador,
    );
    this.clientes.splice(indice, 1);
  }
}

function criarCliente(
  identificador: string,
  nome: string,
  cpfCnpj: string,
): Cliente {
  return Cliente.restaurar({
    identificador,
    nome,
    cpfCnpj,
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });
}

describe('Gerenciamento de clientes', () => {
  it('lista clientes em ordem alfabética', async () => {
    const repositorio = new RepositorioClienteEmMemoria([
      criarCliente('2', 'Zilda', '11144477735'),
      criarCliente('1', 'Ana', '52998224725'),
    ]);

    await expect(
      new CasoUsoListarClientes(repositorio).executar(),
    ).resolves.toEqual([
      expect.objectContaining({ identificador: '1', nome: 'Ana' }),
      expect.objectContaining({ identificador: '2', nome: 'Zilda' }),
    ]);
  });

  it('atualiza nome e CPF/CNPJ do cliente', async () => {
    const repositorio = new RepositorioClienteEmMemoria([
      criarCliente('1', 'Maria', '52998224725'),
    ]);

    const resultado = await new CasoUsoAtualizarCliente(repositorio).executar(
      '1',
      {
        nome: '  Maria Silva  ',
        cpfCnpj: '111.444.777-35',
      },
    );

    expect(resultado).toMatchObject({
      identificador: '1',
      nome: 'Maria Silva',
      cpfCnpj: '11144477735',
    });
    expect(repositorio.clientes[0].nome).toBe('Maria Silva');
  });

  it('rejeita atualização sem nenhum campo', async () => {
    const repositorio = new RepositorioClienteEmMemoria([
      criarCliente('1', 'Maria', '52998224725'),
    ]);

    await expect(
      new CasoUsoAtualizarCliente(repositorio).executar('1', {}),
    ).rejects.toThrow(ErroValidacao);
  });

  it('rejeita CPF/CNPJ já usado por outro cliente', async () => {
    const repositorio = new RepositorioClienteEmMemoria([
      criarCliente('1', 'Maria', '52998224725'),
      criarCliente('2', 'José', '11144477735'),
    ]);

    await expect(
      new CasoUsoAtualizarCliente(repositorio).executar('1', {
        cpfCnpj: '11144477735',
      }),
    ).rejects.toThrow(ErroConflito);
  });

  it('exclui cliente existente', async () => {
    const repositorio = new RepositorioClienteEmMemoria([
      criarCliente('1', 'Maria', '52998224725'),
    ]);

    await new CasoUsoExcluirCliente(repositorio).executar('1');

    expect(repositorio.clientes).toHaveLength(0);
  });

  it('rejeita exclusão de cliente inexistente', async () => {
    const repositorio = new RepositorioClienteEmMemoria();

    await expect(
      new CasoUsoExcluirCliente(repositorio).executar('ausente'),
    ).rejects.toThrow(ErroNaoEncontrado);
  });
});
