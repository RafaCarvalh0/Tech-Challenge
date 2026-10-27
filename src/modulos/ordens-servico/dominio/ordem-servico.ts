import { randomUUID } from 'node:crypto';

import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { StatusOrdemServico } from './status-ordem-servico';

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
}
