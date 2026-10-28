import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { RepositorioComposicaoOrdemServico } from '../aplicacao/composicao-ordem-servico.repositorio';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';

export class RepositorioPrismaComposicaoOrdemServico
  implements RepositorioComposicaoOrdemServico
{
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorOrdemServicoId(
    ordemServicoId: string,
  ): Promise<ComposicaoOrdemServico | null> {
    const [servicos, pecasInsumos] = await Promise.all([
      this.servicoPrisma.itemServicoOrdem.findMany({
        where: { ordemServicoId },
        orderBy: { nome: 'asc' },
      }),
      this.servicoPrisma.itemPecaInsumoOrdem.findMany({
        where: { ordemServicoId },
        orderBy: { nome: 'asc' },
      }),
    ]);
    if (servicos.length === 0 && pecasInsumos.length === 0) {
      return null;
    }

    return ComposicaoOrdemServico.restaurar({
      ordemServicoId,
      servicos: servicos.map((item) => ({
        servicoId: item.servicoId,
        nome: item.nome,
        precoUnitarioEmCentavos: item.precoUnitarioEmCentavos,
        quantidade: item.quantidade,
      })),
      pecasInsumos: pecasInsumos.map((item) => ({
        pecaInsumoId: item.pecaInsumoId,
        codigo: item.codigo,
        nome: item.nome,
        precoUnitarioEmCentavos: item.precoUnitarioEmCentavos,
        quantidade: item.quantidade,
      })),
    });
  }

  async substituir(composicao: ComposicaoOrdemServico): Promise<void> {
    await this.servicoPrisma.$transaction(async (transacao) => {
      await transacao.itemServicoOrdem.deleteMany({
        where: { ordemServicoId: composicao.ordemServicoId },
      });
      await transacao.itemPecaInsumoOrdem.deleteMany({
        where: { ordemServicoId: composicao.ordemServicoId },
      });
      if (composicao.servicos.length > 0) {
        await transacao.itemServicoOrdem.createMany({
          data: composicao.servicos.map((item) => ({
            ordemServicoId: composicao.ordemServicoId,
            ...item,
          })),
        });
      }
      if (composicao.pecasInsumos.length > 0) {
        await transacao.itemPecaInsumoOrdem.createMany({
          data: composicao.pecasInsumos.map((item) => ({
            ordemServicoId: composicao.ordemServicoId,
            ...item,
          })),
        });
      }
    });
  }
}
