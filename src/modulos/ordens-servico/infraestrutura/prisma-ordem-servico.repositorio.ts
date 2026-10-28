import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import {
  FiltrosOrdemServico,
  RepositorioOrdemServico,
} from '../aplicacao/ordem-servico.repositorio';
import { OrdemServico } from '../dominio/ordem-servico';

export class RepositorioPrismaOrdemServico implements RepositorioOrdemServico {
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorId(identificador: string): Promise<OrdemServico | null> {
    const registro = await this.servicoPrisma.ordemServico.findUnique({ where: { identificador: identificador } });
    return registro
      ? OrdemServico.restaurar({
          identificador: registro.identificador,
          clienteId: registro.clienteId,
          veiculoId: registro.veiculoId,
          descricao: registro.descricao,
          codigoAcompanhamento: registro.codigoAcompanhamento,
          status: registro.status,
          inicioExecucaoEm: registro.inicioExecucaoEm,
          finalizadoEm: registro.finalizadoEm,
          criadoEm: registro.criadoEm,
          atualizadoEm: registro.atualizadoEm,
        })
      : null;
  }

  async listar(filtros: FiltrosOrdemServico): Promise<OrdemServico[]> {
    const registros = await this.servicoPrisma.ordemServico.findMany({
      where: {
        clienteId: filtros.clienteId,
        veiculoId: filtros.veiculoId,
        status: filtros.status,
      },
      orderBy: { criadoEm: 'desc' },
    });
    return registros.map((registro) =>
      OrdemServico.restaurar({
        identificador: registro.identificador,
        clienteId: registro.clienteId,
        veiculoId: registro.veiculoId,
        descricao: registro.descricao,
        codigoAcompanhamento: registro.codigoAcompanhamento,
        status: registro.status,
        inicioExecucaoEm: registro.inicioExecucaoEm,
        finalizadoEm: registro.finalizadoEm,
        criadoEm: registro.criadoEm,
        atualizadoEm: registro.atualizadoEm,
      }),
    );
  }

  async salvar(ordemServico: OrdemServico): Promise<void> {
    await this.servicoPrisma.ordemServico.create({
      data: {
        identificador: ordemServico.identificador,
        clienteId: ordemServico.clienteId,
        veiculoId: ordemServico.veiculoId,
        codigoAcompanhamento: ordemServico.codigoAcompanhamento,
        descricao: ordemServico.descricao,
        status: ordemServico.status,
        inicioExecucaoEm: ordemServico.inicioExecucaoEm,
        finalizadoEm: ordemServico.finalizadoEm,
        criadoEm: ordemServico.criadoEm,
        atualizadoEm: ordemServico.atualizadoEm,
      },
    });
  }

  async atualizarStatus(ordemServico: OrdemServico): Promise<void> {
    await this.servicoPrisma.ordemServico.update({
      where: { identificador: ordemServico.identificador },
      data: {
        status: ordemServico.status,
        inicioExecucaoEm: ordemServico.inicioExecucaoEm,
        finalizadoEm: ordemServico.finalizadoEm,
        atualizadoEm: ordemServico.atualizadoEm,
      },
    });
  }
}
