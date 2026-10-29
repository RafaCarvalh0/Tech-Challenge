import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { RepositorioPecaInsumo } from '../../pecas-insumos/aplicacao/peca-insumo.repositorio';
import { PecaInsumo } from '../../pecas-insumos/dominio/peca-insumo';
import { RepositorioServico } from '../../servicos/aplicacao/servico.repositorio';
import { Servico } from '../../servicos/dominio/servico';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';
import { OrdemServico } from '../dominio/ordem-servico';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { RepositorioComposicaoOrdemServico } from './composicao-ordem-servico.repositorio';
import { CasoUsoDefinirComposicaoOrdemServico } from './definir-composicao-ordem-servico.caso-uso';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

const instante = new Date('2026-10-28T12:00:00.000Z');

function criarOrdem(status = StatusOrdemServico.EM_DIAGNOSTICO) {
  return OrdemServico.restaurar({
    identificador: 'ordem-1',
    clienteId: 'cliente-1',
    veiculoId: 'veiculo-1',
    descricao: 'Revisão preventiva',
    codigoAcompanhamento: 'codigo-privado',
    status,
    criadoEm: instante,
    atualizadoEm: instante,
  });
}

function criarServico() {
  return Servico.restaurar({
    identificador: 'servico-1',
    nome: 'Alinhamento',
    descricao: null,
    precoEmCentavos: 8000,
    criadoEm: instante,
    atualizadoEm: instante,
  });
}

function criarPeca(quantidadeEstoque = 5) {
  return PecaInsumo.restaurar({
    identificador: 'peca-1',
    codigo: 'FILTRO-1',
    nome: 'Filtro de óleo',
    descricao: null,
    precoUnitarioEmCentavos: 2500,
    quantidadeEstoque,
    criadoEm: instante,
    atualizadoEm: instante,
  });
}

class RepositorioOrdemFalso implements RepositorioOrdemServico {
  constructor(private readonly ordem: OrdemServico | null) {}

  async buscarPorId(): Promise<OrdemServico | null> {
    return this.ordem;
  }

  async listar(): Promise<OrdemServico[]> {
    return this.ordem ? [this.ordem] : [];
  }

  async salvar(): Promise<void> {}

  async atualizarStatus(): Promise<void> {}
}

class RepositorioComposicaoEmMemoria
  implements RepositorioComposicaoOrdemServico
{
  composicao: ComposicaoOrdemServico | null = null;

  async buscarPorOrdemServicoId(): Promise<ComposicaoOrdemServico | null> {
    return this.composicao;
  }

  async substituir(composicao: ComposicaoOrdemServico): Promise<void> {
    this.composicao = composicao;
  }
}

class RepositorioServicoFalso implements RepositorioServico {
  constructor(private readonly servico: Servico | null) {}

  async buscarPorId(): Promise<Servico | null> {
    return this.servico;
  }

  async buscarPorNome(): Promise<Servico | null> {
    return this.servico;
  }

  async listar(): Promise<Servico[]> {
    return this.servico ? [this.servico] : [];
  }

  async salvar(): Promise<void> {}

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

class RepositorioPecaFalso implements RepositorioPecaInsumo {
  constructor(private readonly peca: PecaInsumo | null) {}

  async buscarPorId(): Promise<PecaInsumo | null> {
    return this.peca;
  }

  async buscarPorCodigo(): Promise<PecaInsumo | null> {
    return this.peca;
  }

  async listar(): Promise<PecaInsumo[]> {
    return this.peca ? [this.peca] : [];
  }

  async salvar(): Promise<void> {}

  async atualizar(): Promise<void> {}

  async excluir(): Promise<void> {}
}

function criarCasoUso(dados?: {
  ordem?: OrdemServico | null;
  servico?: Servico | null;
  peca?: PecaInsumo | null;
}) {
  const composicoes = new RepositorioComposicaoEmMemoria();
  const casoUso = new CasoUsoDefinirComposicaoOrdemServico(
    new RepositorioOrdemFalso(dados?.ordem === undefined ? criarOrdem() : dados.ordem),
    composicoes,
    new RepositorioServicoFalso(
      dados?.servico === undefined ? criarServico() : dados.servico,
    ),
    new RepositorioPecaFalso(
      dados?.peca === undefined ? criarPeca() : dados.peca,
    ),
  );
  return { casoUso, composicoes };
}

const entrada = {
  servicos: [{ servicoId: 'servico-1', quantidade: 2 }],
  pecasInsumos: [{ pecaInsumoId: 'peca-1', quantidade: 3 }],
};

describe('CasoUsoDefinirComposicaoOrdemServico', () => {
  it('substitui a composição durante o diagnóstico e calcula os totais', async () => {
    const { casoUso, composicoes } = criarCasoUso();

    await expect(casoUso.executar('ordem-1', entrada)).resolves.toEqual({
      ordemServicoId: 'ordem-1',
      servicos: [
        {
          servicoId: 'servico-1',
          nome: 'Alinhamento',
          precoUnitarioEmCentavos: 8000,
          quantidade: 2,
          subtotalEmCentavos: 16000,
        },
      ],
      pecasInsumos: [
        {
          pecaInsumoId: 'peca-1',
          codigo: 'FILTRO-1',
          nome: 'Filtro de óleo',
          precoUnitarioEmCentavos: 2500,
          quantidade: 3,
          subtotalEmCentavos: 7500,
        },
      ],
      subtotalServicosEmCentavos: 16000,
      subtotalPecasInsumosEmCentavos: 7500,
      totalEmCentavos: 23500,
    });
    expect(composicoes.composicao?.totalEmCentavos).toBe(23500);
  });

  it('rejeita ordem inexistente ou fora do diagnóstico', async () => {
    await expect(
      criarCasoUso({ ordem: null }).casoUso.executar('ordem-1', entrada),
    ).rejects.toThrow(ErroNaoEncontrado);
    await expect(
      criarCasoUso({ ordem: criarOrdem(StatusOrdemServico.RECEBIDA) })
        .casoUso.executar('ordem-1', entrada),
    ).rejects.toThrow(ErroValidacao);
  });

  it('rejeita serviço inexistente', async () => {
    await expect(
      criarCasoUso({ servico: null }).casoUso.executar('ordem-1', entrada),
    ).rejects.toThrow('Serviço não encontrado');
  });

  it('rejeita peça inexistente', async () => {
    await expect(
      criarCasoUso({ peca: null }).casoUso.executar('ordem-1', entrada),
    ).rejects.toThrow('Peça ou insumo não encontrado');
  });

  it('rejeita quantidade superior ao estoque', async () => {
    await expect(
      criarCasoUso({ peca: criarPeca(2) }).casoUso.executar(
        'ordem-1',
        entrada,
      ),
    ).rejects.toThrow('Estoque insuficiente para FILTRO-1');
  });
});
