import { randomUUID } from "node:crypto";

import { ErroValidacao } from "../../../compartilhado/dominio/erros";

interface EntradaRestaurarServico {
  identificador: string;
  nome: string;
  descricao: string | null;
  precoEmCentavos: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface EntradaAtualizarServico {
  nome?: string;
  descricao?: string | null;
  precoEmCentavos?: number;
}

export class Servico {
  private constructor(
    readonly identificador: string,
    readonly nome: string,
    readonly descricao: string | null,
    readonly precoEmCentavos: number,
    readonly criadoEm: Date,
    readonly atualizadoEm: Date,
  ) {}

  static criar(dadosEntrada: {
    nome: string;
    descricao?: string;
    precoEmCentavos: number;
  }): Servico {
    const agora = new Date();
    return new Servico(
      randomUUID(),
      Servico.normalizarNome(dadosEntrada.nome),
      Servico.normalizarDescricao(dadosEntrada.descricao),
      Servico.validarPreco(dadosEntrada.precoEmCentavos),
      agora,
      agora,
    );
  }

  static restaurar(dadosEntrada: EntradaRestaurarServico): Servico {
    return new Servico(
      dadosEntrada.identificador,
      Servico.normalizarNome(dadosEntrada.nome),
      Servico.normalizarDescricao(dadosEntrada.descricao),
      Servico.validarPreco(dadosEntrada.precoEmCentavos),
      dadosEntrada.criadoEm,
      dadosEntrada.atualizadoEm,
    );
  }

  atualizar(dadosEntrada: EntradaAtualizarServico): Servico {
    return new Servico(
      this.identificador,
      dadosEntrada.nome === undefined
        ? this.nome
        : Servico.normalizarNome(dadosEntrada.nome),
      dadosEntrada.descricao === undefined
        ? this.descricao
        : Servico.normalizarDescricao(dadosEntrada.descricao),
      dadosEntrada.precoEmCentavos === undefined
        ? this.precoEmCentavos
        : Servico.validarPreco(dadosEntrada.precoEmCentavos),
      this.criadoEm,
      new Date(),
    );
  }

  private static normalizarNome(nome: string): string {
    const nomeNormalizado = nome.trim();
    if (!nomeNormalizado) {
      throw new ErroValidacao("Nome do serviço é obrigatório");
    }
    return nomeNormalizado;
  }

  private static normalizarDescricao(
    descricao: string | null | undefined,
  ): string | null {
    const descricaoNormalizada = descricao?.trim();
    return descricaoNormalizada || null;
  }

  private static validarPreco(precoEmCentavos: number): number {
    if (!Number.isInteger(precoEmCentavos) || precoEmCentavos < 0) {
      throw new ErroValidacao(
        "Preço do serviço deve ser um número inteiro não negativo",
      );
    }
    return precoEmCentavos;
  }
}
