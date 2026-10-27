import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { RepositorioOrdemServico } from '../aplicacao/ordem-servico.repositorio';
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
          status: registro.status,
          criadoEm: registro.criadoEm,
          atualizadoEm: registro.atualizadoEm,
        })
      : null;
  }

  async salvar(ordemServico: OrdemServico): Promise<void> {
    await this.servicoPrisma.ordemServico.create({
      data: {
        identificador: ordemServico.identificador,
        clienteId: ordemServico.clienteId,
        veiculoId: ordemServico.veiculoId,
        descricao: ordemServico.descricao,
        status: ordemServico.status,
        criadoEm: ordemServico.criadoEm,
        atualizadoEm: ordemServico.atualizadoEm,
      },
    });
  }
}
