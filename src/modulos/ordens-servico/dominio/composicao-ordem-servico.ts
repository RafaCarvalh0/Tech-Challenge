import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { PecaInsumo } from '../../pecas-insumos/dominio/peca-insumo';
import { Servico } from '../../servicos/dominio/servico';

export interface ItemServicoComposicao {
  servicoId: string;
  nome: string;
  precoUnitarioEmCentavos: number;
  quantidade: number;
}

export interface ItemPecaInsumoComposicao {
  pecaInsumoId: string;
  codigo: string;
  nome: string;
  precoUnitarioEmCentavos: number;
  quantidade: number;
}

interface EntradaCriarComposicao {
  ordemServicoId: string;
  servicos: Array<{ servico: Servico; quantidade: number }>;
  pecasInsumos: Array<{ pecaInsumo: PecaInsumo; quantidade: number }>;
}

export class ComposicaoOrdemServico {
  private constructor(
    readonly ordemServicoId: string,
    readonly servicos: ItemServicoComposicao[],
    readonly pecasInsumos: ItemPecaInsumoComposicao[],
  ) {}

  static criar(dadosEntrada: EntradaCriarComposicao): ComposicaoOrdemServico {
    ComposicaoOrdemServico.validarItensUnicos(
      dadosEntrada.servicos.map((item) => item.servico.identificador),
      'Serviço repetido na composição',
    );
    ComposicaoOrdemServico.validarItensUnicos(
      dadosEntrada.pecasInsumos.map(
        (item) => item.pecaInsumo.identificador,
      ),
      'Peça ou insumo repetido na composição',
    );

    return new ComposicaoOrdemServico(
      dadosEntrada.ordemServicoId,
      dadosEntrada.servicos.map(({ servico, quantidade }) => ({
        servicoId: servico.identificador,
        nome: servico.nome,
        precoUnitarioEmCentavos: servico.precoEmCentavos,
        quantidade: ComposicaoOrdemServico.validarQuantidade(quantidade),
      })),
      dadosEntrada.pecasInsumos.map(({ pecaInsumo, quantidade }) => ({
        pecaInsumoId: pecaInsumo.identificador,
        codigo: pecaInsumo.codigo,
        nome: pecaInsumo.nome,
        precoUnitarioEmCentavos: pecaInsumo.precoUnitarioEmCentavos,
        quantidade: ComposicaoOrdemServico.validarQuantidade(quantidade),
      })),
    );
  }

  static restaurar(dadosEntrada: {
    ordemServicoId: string;
    servicos: ItemServicoComposicao[];
    pecasInsumos: ItemPecaInsumoComposicao[];
  }): ComposicaoOrdemServico {
    return new ComposicaoOrdemServico(
      dadosEntrada.ordemServicoId,
      dadosEntrada.servicos,
      dadosEntrada.pecasInsumos,
    );
  }

  get subtotalServicosEmCentavos(): number {
    return this.servicos.reduce(
      (total, item) =>
        total + item.precoUnitarioEmCentavos * item.quantidade,
      0,
    );
  }

  get subtotalPecasInsumosEmCentavos(): number {
    return this.pecasInsumos.reduce(
      (total, item) =>
        total + item.precoUnitarioEmCentavos * item.quantidade,
      0,
    );
  }

  get totalEmCentavos(): number {
    return (
      this.subtotalServicosEmCentavos +
      this.subtotalPecasInsumosEmCentavos
    );
  }

  private static validarQuantidade(quantidade: number): number {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new ErroValidacao(
        'Quantidade do item deve ser um número inteiro positivo',
      );
    }
    return quantidade;
  }

  private static validarItensUnicos(
    identificadores: string[],
    mensagem: string,
  ): void {
    if (new Set(identificadores).size !== identificadores.length) {
      throw new ErroValidacao(mensagem);
    }
  }
}
