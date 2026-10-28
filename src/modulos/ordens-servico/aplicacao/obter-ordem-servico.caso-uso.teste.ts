import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { Cliente } from '../../clientes/dominio/cliente';
import { RepositorioVeiculo } from '../../veiculos/aplicacao/veiculo.repositorio';
import { Veiculo } from '../../veiculos/dominio/veiculo';
import { OrdemServico } from '../dominio/ordem-servico';
import { CasoUsoObterOrdemServico } from './obter-ordem-servico.caso-uso';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';
import { RepositorioComposicaoOrdemServico } from './composicao-ordem-servico.repositorio';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';

class ConsultaOrdemServico implements RepositorioOrdemServico {
  constructor(private readonly ordemServico: OrdemServico | null) {}

  async buscarPorId(): Promise<OrdemServico | null> {
    return this.ordemServico;
  }

  async listar(): Promise<OrdemServico[]> {
    return this.ordemServico ? [this.ordemServico] : [];
  }

  async salvar(): Promise<void> {}

  async atualizarStatus(): Promise<void> {}
}

class ConsultaCliente implements RepositorioCliente {
  readonly cliente = Cliente.restaurar({
    identificador: 'cliente-identificador',
    nome: 'Maria da Silva',
    cpfCnpj: '52998224725',
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });

  async buscarPorId(): Promise<Cliente | null> {
    return this.cliente;
  }

  async buscarPorCpfCnpj(): Promise<Cliente | null> {
    return this.cliente;
  }

  async listar(): Promise<Cliente[]> {
    return [this.cliente];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

class ConsultaVeiculo implements RepositorioVeiculo {
  readonly veiculo = Veiculo.restaurar({
    identificador: 'veiculo-identificador',
    clienteId: 'cliente-identificador',
    placa: 'ABC1D23',
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2022,
    criadoEm: new Date('2026-10-27T12:00:00.000Z'),
  });

  async buscarPorId(): Promise<Veiculo | null> {
    return this.veiculo;
  }

  async buscarPorPlaca(): Promise<Veiculo | null> {
    return this.veiculo;
  }

  async listar(): Promise<Veiculo[]> {
    return [this.veiculo];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

class ConsultaComposicao implements RepositorioComposicaoOrdemServico {
  async buscarPorOrdemServicoId(): Promise<ComposicaoOrdemServico | null> {
    return null;
  }

  async substituir(): Promise<void> {}
}

describe('CasoUsoObterOrdemServico', () => {
  it('retorna uma ordem de serviço existente', async () => {
    const ordemServico = OrdemServico.restaurar({
      identificador: 'ordem-servico-identificador',
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Troca de óleo',
      status: 'RECEBIDA',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
      atualizadoEm: new Date('2026-10-27T12:00:00.000Z'),
    });
    const casoUso = new CasoUsoObterOrdemServico(
      new ConsultaOrdemServico(ordemServico),
      new ConsultaCliente(),
      new ConsultaVeiculo(),
      new ConsultaComposicao(),
    );

    await expect(
      casoUso.executar('ordem-servico-identificador'),
    ).resolves.toMatchObject({
      identificador: 'ordem-servico-identificador',
      status: 'RECEBIDA',
      cliente: {
        identificador: 'cliente-identificador',
        nome: 'Maria da Silva',
        cpfCnpj: '52998224725',
      },
      veiculo: {
        identificador: 'veiculo-identificador',
        placa: 'ABC1D23',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2022,
      },
      composicao: null,
    });
  });

  it('rejeita ordem de serviço desconhecida', async () => {
    const casoUso = new CasoUsoObterOrdemServico(
      new ConsultaOrdemServico(null),
      new ConsultaCliente(),
      new ConsultaVeiculo(),
      new ConsultaComposicao(),
    );

    await expect(casoUso.executar('ausente')).rejects.toThrow(ErroNaoEncontrado);
  });
});
