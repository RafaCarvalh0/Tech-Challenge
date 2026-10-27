import { randomUUID } from 'node:crypto';

import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { AcaoOrdemServico } from './acao-ordem-servico';
import { StatusOrdemServico } from './status-ordem-servico';

const TRANSICOES: Record<
  AcaoOrdemServico,
  { origem: StatusOrdemServico; destino: StatusOrdemServico }
> = {
  [AcaoOrdemServico.INICIAR_DIAGNOSTICO]: {
    origem: StatusOrdemServico.RECEBIDA,
    destino: StatusOrdemServico.EM_DIAGNOSTICO,
  },
  [AcaoOrdemServico.SOLICITAR_APROVACAO]: {
    origem: StatusOrdemServico.EM_DIAGNOSTICO,
    destino: StatusOrdemServico.AGUARDANDO_APROVACAO,
  },
  [AcaoOrdemServico.APROVAR]: {
    origem: StatusOrdemServico.AGUARDANDO_APROVACAO,
    destino: StatusOrdemServico.EM_EXECUCAO,
  },
  [AcaoOrdemServico.FINALIZAR]: {
    origem: StatusOrdemServico.EM_EXECUCAO,
    destino: StatusOrdemServico.FINALIZADA,
  },
  [AcaoOrdemServico.ENTREGAR]: {
    origem: StatusOrdemServico.FINALIZADA,
    destino: StatusOrdemServico.ENTREGUE,
  },
};

interface PropriedadesOrdemServico {
  clienteId: string;
  veiculoId: string;
  descricao: string;
}

interface EntradaRestaurarOrdemServico extends PropriedadesOrdemServico {
  identificador: string;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class OrdemServico {
  private constructor(
    readonly identificador: string,
    readonly clienteId: string,
    readonly veiculoId: string,
    readonly descricao: string,
    readonly status: StatusOrdemServico,
    readonly criadoEm: Date,
    readonly atualizadoEm: Date,
  ) {}

  static criar(dadosEntrada: PropriedadesOrdemServico): OrdemServico {
    const descricao = dadosEntrada.descricao.trim();
    if (!descricao) {
      throw new ErroValidacao('Descrição da ordem de serviço é obrigatória');
    }

    const agora = new Date();
    return new OrdemServico(
      randomUUID(),
      dadosEntrada.clienteId,
      dadosEntrada.veiculoId,
      descricao,
      StatusOrdemServico.RECEBIDA,
      agora,
      agora,
    );
  }

  static restaurar(dadosEntrada: EntradaRestaurarOrdemServico): OrdemServico {
    return new OrdemServico(
      dadosEntrada.identificador,
      dadosEntrada.clienteId,
      dadosEntrada.veiculoId,
      dadosEntrada.descricao,
      dadosEntrada.status as StatusOrdemServico,
      dadosEntrada.criadoEm,
      dadosEntrada.atualizadoEm,
    );
  }

  executarAcao(acao: AcaoOrdemServico): OrdemServico {
    const transicao = TRANSICOES[acao];
    if (this.status !== transicao.origem) {
      throw new ErroValidacao(
        `A ação ${acao} não é permitida para o status ${this.status}`,
      );
    }

    return new OrdemServico(
      this.identificador,
      this.clienteId,
      this.veiculoId,
      this.descricao,
      transicao.destino,
      this.criadoEm,
      new Date(),
    );
  }
}
