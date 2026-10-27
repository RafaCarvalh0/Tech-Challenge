import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { Cliente } from '../../clientes/dominio/cliente';
import { ErroConflito, ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { Veiculo } from '../dominio/veiculo';
import { CasoUsoCriarVeiculo } from './criar-veiculo.caso-uso';
import { RepositorioVeiculo } from './veiculo.repositorio';

class ConsultaCliente implements RepositorioCliente {
  constructor(private readonly existe: boolean) {}

  async buscarPorId(): Promise<Cliente | null> {
    return this.existe
      ? Cliente.restaurar({
          identificador: 'cliente-identificador',
          nome: 'Maria',
          cpfCnpj: '52998224725',
          criadoEm: new Date('2026-10-27T12:00:00.000Z'),
        })
      : null;
  }

  async buscarPorCpfCnpj(): Promise<Cliente | null> {
    return null;
  }

  async listar(): Promise<Cliente[]> {
    const cliente = await this.buscarPorId();
    return cliente ? [cliente] : [];
  }

  async salvar(): Promise<void> {}

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

class RepositorioVeiculoEmMemoria implements RepositorioVeiculo {
  readonly veiculos: Veiculo[] = [];

  async buscarPorId(identificador: string): Promise<Veiculo | null> {
    return this.veiculos.find((veiculo) => veiculo.identificador === identificador) ?? null;
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    return this.veiculos.find((veiculo) => veiculo.placa.valor === placa) ?? null;
  }

  async salvar(veiculo: Veiculo): Promise<void> {
    this.veiculos.push(veiculo);
  }
}

describe('CasoUsoCriarVeiculo', () => {
  const entrada = {
    clienteId: 'cliente-identificador',
    placa: 'abc1d23',
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2022,
  };

  it('cria um veículo para um cliente existente', async () => {
    const veiculos = new RepositorioVeiculoEmMemoria();
    const casoUso = new CasoUsoCriarVeiculo(
      veiculos,
      new ConsultaCliente(true),
    );

    const veiculo = await casoUso.executar(entrada);

    expect(veiculo).toMatchObject({
      clienteId: 'cliente-identificador',
      placa: 'ABC1D23',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2022,
    });
    expect(veiculos.veiculos).toHaveLength(1);
  });

  it('rejeita veículo para cliente desconhecido', async () => {
    const casoUso = new CasoUsoCriarVeiculo(
      new RepositorioVeiculoEmMemoria(),
      new ConsultaCliente(false),
    );

    await expect(casoUso.executar(entrada)).rejects.toThrow(ErroNaoEncontrado);
  });

  it('rejeita placa duplicada', async () => {
    const veiculos = new RepositorioVeiculoEmMemoria();
    const casoUso = new CasoUsoCriarVeiculo(
      veiculos,
      new ConsultaCliente(true),
    );

    await casoUso.executar(entrada);

    await expect(casoUso.executar(entrada)).rejects.toThrow(ErroConflito);
  });
});
