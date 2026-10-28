import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { RepositorioPecaInsumo } from '../aplicacao/peca-insumo.repositorio';
import { PecaInsumo } from '../dominio/peca-insumo';

export class RepositorioPrismaPecaInsumo implements RepositorioPecaInsumo {
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorId(identificador: string): Promise<PecaInsumo | null> {
    const registro = await this.servicoPrisma.pecaInsumo.findUnique({
      where: { identificador },
    });
    return registro ? PecaInsumo.restaurar(registro) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<PecaInsumo | null> {
    const registro = await this.servicoPrisma.pecaInsumo.findUnique({
      where: { codigo },
    });
    return registro ? PecaInsumo.restaurar(registro) : null;
  }

  async listar(): Promise<PecaInsumo[]> {
    const registros = await this.servicoPrisma.pecaInsumo.findMany({
      orderBy: { nome: 'asc' },
    });
    return registros.map((registro) => PecaInsumo.restaurar(registro));
  }

  async salvar(pecaInsumo: PecaInsumo): Promise<void> {
    try {
      await this.servicoPrisma.pecaInsumo.create({
        data: {
          identificador: pecaInsumo.identificador,
          codigo: pecaInsumo.codigo,
          nome: pecaInsumo.nome,
          descricao: pecaInsumo.descricao,
          precoUnitarioEmCentavos: pecaInsumo.precoUnitarioEmCentavos,
          quantidadeEstoque: pecaInsumo.quantidadeEstoque,
          criadoEm: pecaInsumo.criadoEm,
          atualizadoEm: pecaInsumo.atualizadoEm,
        },
      });
    } catch (error_) {
      this.converterErroUnicidade(error_);
    }
  }

  async atualizar(pecaInsumo: PecaInsumo): Promise<void> {
    try {
      await this.servicoPrisma.pecaInsumo.update({
        where: { identificador: pecaInsumo.identificador },
        data: {
          codigo: pecaInsumo.codigo,
          nome: pecaInsumo.nome,
          descricao: pecaInsumo.descricao,
          precoUnitarioEmCentavos: pecaInsumo.precoUnitarioEmCentavos,
          quantidadeEstoque: pecaInsumo.quantidadeEstoque,
          atualizadoEm: pecaInsumo.atualizadoEm,
        },
      });
    } catch (error_) {
      this.converterErroUnicidade(error_);
    }
  }

  async excluir(identificador: string): Promise<void> {
    await this.servicoPrisma.pecaInsumo.delete({ where: { identificador } });
  }

  private converterErroUnicidade(error_: unknown): never {
    if (
      error_ instanceof PrismaClientKnownRequestError &&
      error_.code === 'P2002'
    ) {
      throw new ErroConflito(
        'Peça ou insumo já cadastrado com este código',
      );
    }
    throw error_;
  }
}
