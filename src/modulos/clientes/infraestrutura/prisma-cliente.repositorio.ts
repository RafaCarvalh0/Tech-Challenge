import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { RepositorioCliente } from '../aplicacao/cliente.repositorio';
import { Cliente } from '../dominio/cliente';

export class RepositorioPrismaCliente implements RepositorioCliente {
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorId(identificador: string): Promise<Cliente | null> {
    const registro = await this.servicoPrisma.cliente.findUnique({ where: { identificador: identificador } });
    return registro
      ? Cliente.restaurar({
          identificador: registro.identificador,
          nome: registro.nome,
          cpfCnpj: registro.cpfCnpj,
          criadoEm: registro.criadoEm,
        })
      : null;
  }

  async buscarPorCpfCnpj(cpfCnpj: string): Promise<Cliente | null> {
    const registro = await this.servicoPrisma.cliente.findUnique({ where: { cpfCnpj: cpfCnpj } });
    return registro
      ? Cliente.restaurar({
          identificador: registro.identificador,
          nome: registro.nome,
          cpfCnpj: registro.cpfCnpj,
          criadoEm: registro.criadoEm,
        })
      : null;
  }

  async salvar(cliente: Cliente): Promise<void> {
    try {
      await this.servicoPrisma.cliente.create({
        data: {
          identificador: cliente.identificador,
          nome: cliente.nome,
          cpfCnpj: cliente.cpfCnpj.valor,
          criadoEm: cliente.criadoEm,
        },
      });
    } catch (error_) {
      if (
        error_ instanceof PrismaClientKnownRequestError &&
        error_.code === 'P2002'
      ) {
        throw new ErroConflito('Cliente já cadastrado para este CPF/CNPJ');
      }
      throw error_;
    }
  }
}
