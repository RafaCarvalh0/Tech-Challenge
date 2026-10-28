import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { ServicoPrisma } from "../../../banco-dados/prisma.servico";
import { ErroConflito } from "../../../compartilhado/dominio/erros";
import { RepositorioServico } from "../aplicacao/servico.repositorio";
import { Servico } from "../dominio/servico";

export class RepositorioPrismaServico implements RepositorioServico {
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorId(identificador: string): Promise<Servico | null> {
    const registro = await this.servicoPrisma.servico.findUnique({
      where: { identificador },
    });
    return registro ? Servico.restaurar(registro) : null;
  }

  async buscarPorNome(nome: string): Promise<Servico | null> {
    const registro = await this.servicoPrisma.servico.findUnique({
      where: { nome },
    });
    return registro ? Servico.restaurar(registro) : null;
  }

  async listar(): Promise<Servico[]> {
    const registros = await this.servicoPrisma.servico.findMany({
      orderBy: { nome: "asc" },
    });
    return registros.map((registro) => Servico.restaurar(registro));
  }

  async salvar(servico: Servico): Promise<void> {
    try {
      await this.servicoPrisma.servico.create({ data: { ...servico } });
    } catch (error_) {
      this.converterErroUnicidade(error_);
    }
  }

  async atualizar(servico: Servico): Promise<void> {
    try {
      await this.servicoPrisma.servico.update({
        where: { identificador: servico.identificador },
        data: {
          nome: servico.nome,
          descricao: servico.descricao,
          precoEmCentavos: servico.precoEmCentavos,
          atualizadoEm: servico.atualizadoEm,
        },
      });
    } catch (error_) {
      this.converterErroUnicidade(error_);
    }
  }

  async excluir(identificador: string): Promise<void> {
    await this.servicoPrisma.servico.delete({ where: { identificador } });
  }

  private converterErroUnicidade(error_: unknown): never {
    if (
      error_ instanceof PrismaClientKnownRequestError &&
      error_.code === "P2002"
    ) {
      throw new ErroConflito("Serviço já cadastrado com este nome");
    }
    throw error_;
  }
}
