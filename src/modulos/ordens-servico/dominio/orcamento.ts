import { randomUUID } from 'node:crypto';

import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { ComposicaoOrdemServico } from './composicao-ordem-servico';
import { SituacaoOrcamento } from './situacao-orcamento';

interface EntradaRestaurarOrcamento {
  identificador: string;
  ordemServicoId: string;
  subtotalServicosEmCentavos: number;
  subtotalPecasInsumosEmCentavos: number;
  totalEmCentavos: number;
  situacao: string;
  geradoEm: Date;
  atualizadoEm: Date;
  decididoEm: Date | null;
}

export class Orcamento {
  private constructor(
    readonly identificador: string,
    readonly ordemServicoId: string,
    readonly subtotalServicosEmCentavos: number,
    readonly subtotalPecasInsumosEmCentavos: number,
    readonly totalEmCentavos: number,
    readonly situacao: SituacaoOrcamento,
    readonly geradoEm: Date,
    readonly atualizadoEm: Date,
    readonly decididoEm: Date | null,
  ) {}

  static criar(composicao: ComposicaoOrdemServico): Orcamento {
    if (
      composicao.servicos.length === 0 &&
      composicao.pecasInsumos.length === 0
    ) {
      throw new ErroValidacao(
        'Inclua ao menos um serviço ou peça antes de enviar o orçamento',
      );
    }

    const agora = new Date();
    return new Orcamento(
      randomUUID(),
      composicao.ordemServicoId,
      composicao.subtotalServicosEmCentavos,
      composicao.subtotalPecasInsumosEmCentavos,
      composicao.totalEmCentavos,
      SituacaoOrcamento.PENDENTE,
      agora,
      agora,
      null,
    );
  }

  static restaurar(dadosEntrada: EntradaRestaurarOrcamento): Orcamento {
    return new Orcamento(
      dadosEntrada.identificador,
      dadosEntrada.ordemServicoId,
      dadosEntrada.subtotalServicosEmCentavos,
      dadosEntrada.subtotalPecasInsumosEmCentavos,
      dadosEntrada.totalEmCentavos,
      dadosEntrada.situacao as SituacaoOrcamento,
      dadosEntrada.geradoEm,
      dadosEntrada.atualizadoEm,
      dadosEntrada.decididoEm,
    );
  }
}
