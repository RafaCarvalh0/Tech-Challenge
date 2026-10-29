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
import { RepositorioOrcamento } from './orcamento.repositorio';
import { Orcamento } from '../dominio/orcamento';
import { SituacaoOrcamento } from '../dominio/situacao-orcamento';

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
  constructor(
    readonly cliente: Cliente | null = Cliente.restaurar({
      identificador: 'cliente-identificador',
      nome: 'Maria da Silva',
      cpfCnpj: '52998224725',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    }),
  ) {}

  async buscarPorId(): Promise<Cliente | null> {
    return this.cliente;
  }

  async buscarPorCpfCnpj(): Promise<Cliente | null> {
    return this.cliente;
  }

  async listar(): Promise<Cliente[]> {
    return this.cliente ? [this.cliente] : [];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

class ConsultaVeiculo implements RepositorioVeiculo {
  constructor(
    readonly veiculo: Veiculo | null = Veiculo.restaurar({
      identificador: 'veiculo-identificador',
      clienteId: 'cliente-identificador',
      placa: 'ABC1D23',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2022,
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
    }),
  ) {}

  async buscarPorId(): Promise<Veiculo | null> {
    return this.veiculo;
  }

  async buscarPorPlaca(): Promise<Veiculo | null> {
    return this.veiculo;
  }

  async listar(): Promise<Veiculo[]> {
    return this.veiculo ? [this.veiculo] : [];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

class ConsultaComposicao implements RepositorioComposicaoOrdemServico {
  constructor(
    private readonly composicao: ComposicaoOrdemServico | null = null,
  ) {}

  async buscarPorOrdemServicoId(): Promise<ComposicaoOrdemServico | null> {
    return this.composicao;
  }

  async substituir(): Promise<void> {}
}

class ConsultaOrcamento implements RepositorioOrcamento {
  constructor(private readonly orcamento: Orcamento | null = null) {}

  async buscarPorOrdemServicoId(): Promise<Orcamento | null> {
    return this.orcamento;
  }

  async enviar(): Promise<Orcamento> {
    throw new Error('Método não utilizado neste teste');
  }

  async decidir(): Promise<{
    orcamento: Orcamento;
    ordemServico: OrdemServico;
  }> {
    throw new Error('Método não utilizado neste teste');
  }
}

describe('CasoUsoObterOrdemServico', () => {
  it('retorna uma ordem de serviço existente', async () => {
    const ordemServico = OrdemServico.restaurar({
      identificador: 'ordem-servico-identificador',
      codigoAcompanhamento: 'codigo-acompanhamento',
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
      new ConsultaOrcamento(),
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
      orcamento: null,
    });
  });

  it('rejeita ordem de serviço desconhecida', async () => {
    const casoUso = new CasoUsoObterOrdemServico(
      new ConsultaOrdemServico(null),
      new ConsultaCliente(),
      new ConsultaVeiculo(),
      new ConsultaComposicao(),
      new ConsultaOrcamento(),
    );

    await expect(casoUso.executar('ausente')).rejects.toThrow(
      ErroNaoEncontrado,
    );
  });

  it('retorna composição e orçamento vinculados à ordem', async () => {
    const ordemServico = OrdemServico.restaurar({
      identificador: 'ordem-servico-identificador',
      codigoAcompanhamento: 'codigo-acompanhamento',
      clienteId: 'cliente-identificador',
      veiculoId: 'veiculo-identificador',
      descricao: 'Troca de óleo',
      status: 'AGUARDANDO_APROVACAO',
      criadoEm: new Date('2026-10-27T12:00:00.000Z'),
      atualizadoEm: new Date('2026-10-27T12:30:00.000Z'),
    });
    const composicao = ComposicaoOrdemServico.restaurar({
      ordemServicoId: ordemServico.identificador,
      servicos: [
        {
          servicoId: 'servico-1',
          nome: 'Troca de óleo',
          precoUnitarioEmCentavos: 15000,
          quantidade: 1,
        },
      ],
      pecasInsumos: [],
    });
    const orcamento = Orcamento.restaurar({
      identificador: 'orcamento-1',
      ordemServicoId: ordemServico.identificador,
      subtotalServicosEmCentavos: 15000,
      subtotalPecasInsumosEmCentavos: 0,
      totalEmCentavos: 15000,
      situacao: SituacaoOrcamento.PENDENTE,
      geradoEm: new Date('2026-10-27T12:30:00.000Z'),
      atualizadoEm: new Date('2026-10-27T12:30:00.000Z'),
      decididoEm: null,
    });
    const casoUso = new CasoUsoObterOrdemServico(
      new ConsultaOrdemServico(ordemServico),
      new ConsultaCliente(),
      new ConsultaVeiculo(),
      new ConsultaComposicao(composicao),
      new ConsultaOrcamento(orcamento),
    );

    await expect(
      casoUso.executar(ordemServico.identificador),
    ).resolves.toMatchObject({
      composicao: {
        ordemServicoId: ordemServico.identificador,
        totalEmCentavos: 15000,
      },
      orcamento: {
        identificador: 'orcamento-1',
        totalEmCentavos: 15000,
        situacao: SituacaoOrcamento.PENDENTE,
      },
    });
  });

  it.each([
    ['cliente', new ConsultaCliente(null), new ConsultaVeiculo()],
    ['veículo', new ConsultaCliente(), new ConsultaVeiculo(null)],
  ])(
    'rejeita ordem quando o %s vinculado não existe',
    async (_vinculo, clientes, veiculos) => {
      const ordemServico = OrdemServico.restaurar({
        identificador: 'ordem-servico-identificador',
        codigoAcompanhamento: 'codigo-acompanhamento',
        clienteId: 'cliente-identificador',
        veiculoId: 'veiculo-identificador',
        descricao: 'Troca de óleo',
        status: 'RECEBIDA',
        criadoEm: new Date('2026-10-27T12:00:00.000Z'),
        atualizadoEm: new Date('2026-10-27T12:00:00.000Z'),
      });
      const casoUso = new CasoUsoObterOrdemServico(
        new ConsultaOrdemServico(ordemServico),
        clientes,
        veiculos,
        new ConsultaComposicao(),
        new ConsultaOrcamento(),
      );

      await expect(
        casoUso.executar(ordemServico.identificador),
      ).rejects.toThrow(ErroNaoEncontrado);
    },
  );
});
