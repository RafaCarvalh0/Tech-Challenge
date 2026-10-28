import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { Cliente } from '../../clientes/dominio/cliente';
import { RepositorioVeiculo } from '../../veiculos/aplicacao/veiculo.repositorio';
import { Veiculo } from '../../veiculos/dominio/veiculo';
import { OrdemServico } from '../dominio/ordem-servico';
import { CasoUsoAbrirOrdemServico } from './abrir-ordem-servico.caso-uso';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

class RepositorioClienteEmMemoria implements RepositorioCliente {
  constructor(private readonly cliente: Cliente | null) {}

  async buscarPorId(): Promise<Cliente | null> {
    return this.cliente;
  }

  async buscarPorCpfCnpj(cpfCnpj: string): Promise<Cliente | null> {
    return this.cliente?.cpfCnpj.valor === cpfCnpj ? this.cliente : null;
  }

  async listar(): Promise<Cliente[]> {
    return this.cliente ? [this.cliente] : [];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

class RepositorioVeiculoEmMemoria implements RepositorioVeiculo {
  constructor(readonly veiculos: Veiculo[] = []) {}

  async buscarPorId(identificador: string): Promise<Veiculo | null> {
    return this.veiculos.find((veiculo) => veiculo.identificador === identificador) ?? null;
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    return this.veiculos.find((veiculo) => veiculo.placa.valor === placa) ?? null;
  }

  async listar(): Promise<Veiculo[]> {
    return this.veiculos;
  }

  async salvar(veiculo: Veiculo): Promise<void> {
    this.veiculos.push(veiculo);
  }

  async atualizar(): Promise<void> {}

  async excluir(identificador: string): Promise<void> {
    const indice = this.veiculos.findIndex(
      (veiculo) => veiculo.identificador === identificador,
    );
    this.veiculos.splice(indice, 1);
  }
}

class RepositorioOrdemServicoEmMemoria implements RepositorioOrdemServico {
  readonly ordensServico: OrdemServico[] = [];

  constructor(private readonly falharAoSalvar = false) {}

  async buscarPorId(): Promise<OrdemServico | null> {
    return null;
  }

  async listar(): Promise<OrdemServico[]> {
    return this.ordensServico;
  }

  async salvar(ordemServico: OrdemServico): Promise<void> {
    if (this.falharAoSalvar) {
      throw new Error('Falha simulada no banco');
    }
    this.ordensServico.push(ordemServico);
  }

  async atualizarStatus(): Promise<void> {}
}

function criarCliente(): Cliente {
  return Cliente.restaurar({
    identificador: 'cliente-1',
    nome: 'Maria da Silva',
    cpfCnpj: '52998224725',
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });
}

function criarVeiculo(clienteId = 'cliente-1'): Veiculo {
  return Veiculo.restaurar({
    identificador: 'veiculo-1',
    clienteId,
    placa: 'ABC1D23',
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2022,
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });
}

describe('Abertura da ordem de serviço', () => {
  const entradaBase = {
    cpfCnpj: '529.982.247-25',
    descricao: 'Troca de óleo',
    veiculo: { placa: 'abc1d23' },
  };

  it('abre a OS usando CPF/CNPJ e veículo já cadastrado', async () => {
    const ordensServico = new RepositorioOrdemServicoEmMemoria();
    const casoUso = new CasoUsoAbrirOrdemServico(
      ordensServico,
      new RepositorioClienteEmMemoria(criarCliente()),
      new RepositorioVeiculoEmMemoria([criarVeiculo()]),
    );

    const resultado = await casoUso.executar(entradaBase);

    expect(resultado).toMatchObject({
      clienteId: 'cliente-1',
      veiculoId: 'veiculo-1',
      status: 'RECEBIDA',
    });
    expect(ordensServico.ordensServico).toHaveLength(1);
  });

  it('cadastra o veículo novo durante a abertura', async () => {
    const veiculos = new RepositorioVeiculoEmMemoria();
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new RepositorioClienteEmMemoria(criarCliente()),
      veiculos,
    );

    const resultado = await casoUso.executar({
      ...entradaBase,
      veiculo: {
        placa: 'BRA2E19',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2024,
      },
    });

    expect(veiculos.veiculos).toHaveLength(1);
    expect(resultado.veiculoId).toBe(veiculos.veiculos[0].identificador);
  });

  it('rejeita cliente não cadastrado', async () => {
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new RepositorioClienteEmMemoria(null),
      new RepositorioVeiculoEmMemoria(),
    );

    await expect(casoUso.executar(entradaBase)).rejects.toThrow(
      ErroNaoEncontrado,
    );
  });

  it('rejeita veículo pertencente a outro cliente', async () => {
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new RepositorioClienteEmMemoria(criarCliente()),
      new RepositorioVeiculoEmMemoria([criarVeiculo('outro-cliente')]),
    );

    await expect(casoUso.executar(entradaBase)).rejects.toThrow(ErroConflito);
  });

  it('exige dados completos para cadastrar veículo novo', async () => {
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioOrdemServicoEmMemoria(),
      new RepositorioClienteEmMemoria(criarCliente()),
      new RepositorioVeiculoEmMemoria(),
    );

    await expect(casoUso.executar(entradaBase)).rejects.toThrow(ErroValidacao);
  });

  it('remove o veículo novo quando a criação da OS falha', async () => {
    const veiculos = new RepositorioVeiculoEmMemoria();
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioOrdemServicoEmMemoria(true),
      new RepositorioClienteEmMemoria(criarCliente()),
      veiculos,
    );

    await expect(
      casoUso.executar({
        ...entradaBase,
        veiculo: {
          placa: 'BRA2E19',
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 2024,
        },
      }),
    ).rejects.toThrow('Falha simulada no banco');
    expect(veiculos.veiculos).toHaveLength(0);
  });
});
