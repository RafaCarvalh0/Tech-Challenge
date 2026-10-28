import { randomUUID } from 'node:crypto';

import { ErroValidacao } from '../../../compartilhado/dominio/erros';
import { TipoMovimentacaoEstoque } from './tipo-movimentacao-estoque';

interface EntradaRestaurarPecaInsumo {
  identificador: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  precoUnitarioEmCentavos: number;
  quantidadeEstoque: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface EntradaAtualizarPecaInsumo {
  codigo?: string;
  nome?: string;
  descricao?: string | null;
  precoUnitarioEmCentavos?: number;
}

export class PecaInsumo {
  private constructor(
    readonly identificador: string,
    readonly codigo: string,
    readonly nome: string,
    readonly descricao: string | null,
    readonly precoUnitarioEmCentavos: number,
    readonly quantidadeEstoque: number,
    readonly criadoEm: Date,
    readonly atualizadoEm: Date,
  ) {}

  static criar(dadosEntrada: {
    codigo: string;
    nome: string;
    descricao?: string;
    precoUnitarioEmCentavos: number;
    quantidadeEstoque?: number;
  }): PecaInsumo {
    const agora = new Date();
    return new PecaInsumo(
      randomUUID(),
      PecaInsumo.normalizarCodigo(dadosEntrada.codigo),
      PecaInsumo.normalizarNome(dadosEntrada.nome),
      PecaInsumo.normalizarDescricao(dadosEntrada.descricao),
      PecaInsumo.validarValorNaoNegativo(
        dadosEntrada.precoUnitarioEmCentavos,
        'Preço unitário',
      ),
      PecaInsumo.validarValorNaoNegativo(
        dadosEntrada.quantidadeEstoque ?? 0,
        'Quantidade em estoque',
      ),
      agora,
      agora,
    );
  }

  static restaurar(dadosEntrada: EntradaRestaurarPecaInsumo): PecaInsumo {
    return new PecaInsumo(
      dadosEntrada.identificador,
      PecaInsumo.normalizarCodigo(dadosEntrada.codigo),
      PecaInsumo.normalizarNome(dadosEntrada.nome),
      PecaInsumo.normalizarDescricao(dadosEntrada.descricao),
      PecaInsumo.validarValorNaoNegativo(
        dadosEntrada.precoUnitarioEmCentavos,
        'Preço unitário',
      ),
      PecaInsumo.validarValorNaoNegativo(
        dadosEntrada.quantidadeEstoque,
        'Quantidade em estoque',
      ),
      dadosEntrada.criadoEm,
      dadosEntrada.atualizadoEm,
    );
  }

  atualizar(dadosEntrada: EntradaAtualizarPecaInsumo): PecaInsumo {
    return new PecaInsumo(
      this.identificador,
      dadosEntrada.codigo === undefined
        ? this.codigo
        : PecaInsumo.normalizarCodigo(dadosEntrada.codigo),
      dadosEntrada.nome === undefined
        ? this.nome
        : PecaInsumo.normalizarNome(dadosEntrada.nome),
      dadosEntrada.descricao === undefined
        ? this.descricao
        : PecaInsumo.normalizarDescricao(dadosEntrada.descricao),
      dadosEntrada.precoUnitarioEmCentavos === undefined
        ? this.precoUnitarioEmCentavos
        : PecaInsumo.validarValorNaoNegativo(
            dadosEntrada.precoUnitarioEmCentavos,
            'Preço unitário',
          ),
      this.quantidadeEstoque,
      this.criadoEm,
      new Date(),
    );
  }

  movimentarEstoque(
    tipo: TipoMovimentacaoEstoque,
    quantidade: number,
  ): PecaInsumo {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new ErroValidacao(
        'Quantidade da movimentação deve ser um número inteiro positivo',
      );
    }

    const variacao =
      tipo === TipoMovimentacaoEstoque.ENTRADA ? quantidade : -quantidade;
    const novaQuantidade = this.quantidadeEstoque + variacao;
    if (novaQuantidade < 0) {
      throw new ErroValidacao('Estoque insuficiente para a saída solicitada');
    }

    return new PecaInsumo(
      this.identificador,
      this.codigo,
      this.nome,
      this.descricao,
      this.precoUnitarioEmCentavos,
      novaQuantidade,
      this.criadoEm,
      new Date(),
    );
  }

  private static normalizarCodigo(codigo: string): string {
    const codigoNormalizado = codigo.trim().toUpperCase();
    if (!codigoNormalizado) {
      throw new ErroValidacao('Código da peça ou insumo é obrigatório');
    }
    return codigoNormalizado;
  }

  private static normalizarNome(nome: string): string {
    const nomeNormalizado = nome.trim();
    if (!nomeNormalizado) {
      throw new ErroValidacao('Nome da peça ou insumo é obrigatório');
    }
    return nomeNormalizado;
  }

  private static normalizarDescricao(
    descricao: string | null | undefined,
  ): string | null {
    const descricaoNormalizada = descricao?.trim();
    return descricaoNormalizada || null;
  }

  private static validarValorNaoNegativo(
    valor: number,
    nomeCampo: string,
  ): number {
    if (!Number.isInteger(valor) || valor < 0) {
      throw new ErroValidacao(
        `${nomeCampo} deve ser um número inteiro não negativo`,
      );
    }
    return valor;
  }
}
