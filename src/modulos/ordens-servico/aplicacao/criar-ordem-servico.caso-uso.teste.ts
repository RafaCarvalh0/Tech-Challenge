import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { Cliente } from '../../clientes/dominio/cliente';
import { RepositorioVeiculo } from '../../veiculos/aplicacao/veiculo.repositorio';
import { Veiculo } from '../../veiculos/dominio/veiculo';
import { ErroNaoEncontrado, ErroValidacao } from '../../../compartilhado/dominio/erros';
import { OrdemServico } from '../dominio/ordem-servico';
import { CasoUsoCriarOrdemServico } from './criar-ordem-servico.caso-uso';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

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

class ConsultaVeiculo implements RepositorioVeiculo {
  constructor(
    private readonly existe: boolean,
    private readonly clienteId = 'cliente-identificador',
  ) {}

  async buscarPorId(): Promise<Veiculo | null> {
    return this.existe
      ? Veiculo.restaurar({
          identificador: 'veiculo-identificador',
          clienteId: this.clienteId,
          placa: 'ABC1D23',
          marca: 'Honda',
          modelo: 'Civic',
          ano: 2022,
          criadoEm: new Date('2026-10-27T12:00:00.000Z'),
        })
      : null;
  }

  async buscarPorPlaca(): Promise<Veiculo | null> {
    return null;
  }

  async listar(): Promise<Veiculo[]> {
    const veiculo = await this.buscarPorId();
    return veiculo ? [veiculo] : [];
  }

  async salvar(): Promise<void> {}

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

class RepositorioOrdemServicoEmMemoria implements RepositorioOrdemServico {
  readonly ordensServico: OrdemServico[] = [];

  async buscarPorId(identificador: string): Promise<OrdemServico | null> {
    return this.ordensServico.find((ordemServico) => ordemServico.identificador === identificador) ?? null;
  }

  async listar(): Promise<OrdemServico[]> {
    return this.ordensServico;
  }

  async salvar(ordemServico: OrdemServico): Promise<void> {
    this.ordensServico.push(ordemServico);
  }

  async atualizarStatus(): Promise<void> {}
}

describe('CasoUsoCriarOrdemServico', () => {
  const entrada = {
    clienteId: 'cliente-identificador',
    veiculoId: 'veiculo-identificador',
    descricao: 'Troca de óleo e diagnóstico dos freios',
  };

  it('cria ordem de serviço recebida para o veículo do cliente', async () => {
    const repositorio = new RepositorioOrdemServicoEmMemoria();
    const casoUso = new CasoUsoCriarOrdemServico(
      repositorio,
      new ConsultaCliente(true),
      new ConsultaVeiculo(true),
    );

    const ordemServico = await casoUso.executar(entrada);

    expect(ordemServico).toMatchObject({
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      status: 'RECEBIDA',
      codigoAcompanhamento: expect.any(String),
    });
    expect(repositorio.ordensServico).toHaveLength(1);
  });

  it('rejeita cliente desconhecido', async () => {
    const casoUso = new CasoUsoCriarOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new ConsultaCliente(false),
      new ConsultaVeiculo(true),
    );

    await expect(casoUso.executar(entrada)).rejects.toThrow(ErroNaoEncontrado);
  });

  it('rejeita um veículo desconhecido', async () => {
    const casoUso = new CasoUsoCriarOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new ConsultaCliente(true),
      new ConsultaVeiculo(false),
    );

    await expect(casoUso.executar(entrada)).rejects.toThrow(ErroNaoEncontrado);
  });

  it('rejeita veículo pertencente a outro cliente', async () => {
    const casoUso = new CasoUsoCriarOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new ConsultaCliente(true),
      new ConsultaVeiculo(true, 'outro-cliente'),
    );

    await expect(casoUso.executar(entrada)).rejects.toThrow(ErroValidacao);
  });
});
