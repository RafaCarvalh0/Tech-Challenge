import { randomUUID } from 'node:crypto';

import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { CpfCnpj } from './cpf-cnpj';

interface EntradaRestaurarCliente {
  identificador: string;
  nome: string;
  cpfCnpj: string;
  criadoEm: Date;
}

export class Cliente {
  private constructor(
    readonly identificador: string,
    readonly nome: string,
    readonly cpfCnpj: CpfCnpj,
    readonly criadoEm: Date,
  ) {}

  static criar(dadosEntrada: { nome: string; cpfCnpj: string }): Cliente {
    const nome = Cliente.normalizarNome(dadosEntrada.nome);
    return new Cliente(
      randomUUID(),
      nome,
      CpfCnpj.criar(dadosEntrada.cpfCnpj),
      new Date(),
    );
  }

  static restaurar(dadosEntrada: EntradaRestaurarCliente): Cliente {
    return new Cliente(
      dadosEntrada.identificador,
      Cliente.normalizarNome(dadosEntrada.nome),
      CpfCnpj.criar(dadosEntrada.cpfCnpj),
      dadosEntrada.criadoEm,
    );
  }

  atualizar(dadosEntrada: { nome?: string; cpfCnpj?: string }): Cliente {
    return new Cliente(
      this.identificador,
      dadosEntrada.nome === undefined
        ? this.nome
        : Cliente.normalizarNome(dadosEntrada.nome),
      dadosEntrada.cpfCnpj === undefined
        ? this.cpfCnpj
        : CpfCnpj.criar(dadosEntrada.cpfCnpj),
      this.criadoEm,
    );
  }

  private static normalizarNome(nome: string): string {
    const nomeNormalizado = nome.trim();
    if (!nomeNormalizado) {
      throw new ErroValidacao('Nome do cliente é obrigatório');
    }
    return nomeNormalizado;
  }
}
