import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { RepositorioVeiculo } from '../aplicacao/veiculo.repositorio';
import { Veiculo } from '../dominio/veiculo';

export class RepositorioPrismaVeiculo implements RepositorioVeiculo {
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorId(identificador: string): Promise<Veiculo | null> {
    const registro = await this.servicoPrisma.veiculo.findUnique({ where: { identificador: identificador } });
    return registro
      ? Veiculo.restaurar({
          identificador: registro.identificador,
          clienteId: registro.clienteId,
          placa: registro.placa,
          marca: registro.marca,
          modelo: registro.modelo,
          ano: registro.ano,
          criadoEm: registro.criadoEm,
        })
      : null;
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    const registro = await this.servicoPrisma.veiculo.findUnique({ where: { placa } });
    return registro
      ? Veiculo.restaurar({
          identificador: registro.identificador,
          clienteId: registro.clienteId,
          placa: registro.placa,
          marca: registro.marca,
          modelo: registro.modelo,
          ano: registro.ano,
          criadoEm: registro.criadoEm,
        })
      : null;
  }

  async listar(clienteId?: string): Promise<Veiculo[]> {
    const registros = await this.servicoPrisma.veiculo.findMany({
      where: clienteId ? { clienteId } : undefined,
      orderBy: { placa: 'asc' },
    });
    return registros.map((registro) =>
      Veiculo.restaurar({
        identificador: registro.identificador,
        clienteId: registro.clienteId,
        placa: registro.placa,
        marca: registro.marca,
        modelo: registro.modelo,
        ano: registro.ano,
        criadoEm: registro.criadoEm,
      }),
    );
  }

  async salvar(veiculo: Veiculo): Promise<void> {
    try {
      await this.servicoPrisma.veiculo.create({
        data: {
          identificador: veiculo.identificador,
          clienteId: veiculo.clienteId,
          placa: veiculo.placa.valor,
          marca: veiculo.marca,
          modelo: veiculo.modelo,
          ano: veiculo.ano,
          criadoEm: veiculo.criadoEm,
        },
      });
    } catch (error_) {
      if (
        error_ instanceof PrismaClientKnownRequestError &&
        error_.code === 'P2002'
      ) {
        throw new ErroConflito('Veículo já cadastrado para esta placa');
      }
      throw error_;
    }
  }

  async atualizar(veiculo: Veiculo): Promise<void> {
    try {
      await this.servicoPrisma.veiculo.update({
        where: { identificador: veiculo.identificador },
        data: {
          placa: veiculo.placa.valor,
          marca: veiculo.marca,
          modelo: veiculo.modelo,
          ano: veiculo.ano,
        },
      });
    } catch (error_) {
      if (
        error_ instanceof PrismaClientKnownRequestError &&
        error_.code === 'P2002'
      ) {
        throw new ErroConflito('Veículo já cadastrado para esta placa');
      }
      throw error_;
    }
  }

  async excluir(identificador: string): Promise<void> {
    try {
      await this.servicoPrisma.veiculo.delete({ where: { identificador } });
    } catch (error_) {
      if (
        error_ instanceof PrismaClientKnownRequestError &&
        error_.code === 'P2003'
      ) {
        throw new ErroConflito('Veículo possui ordens de serviço');
      }
      throw error_;
    }
  }
}
