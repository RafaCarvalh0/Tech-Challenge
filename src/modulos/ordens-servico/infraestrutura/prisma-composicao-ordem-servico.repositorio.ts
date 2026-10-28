import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { RepositorioComposicaoOrdemServico } from '../aplicacao/composicao-ordem-servico.repositorio';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';
import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';

export class RepositorioPrismaComposicaoOrdemServico implements RepositorioComposicaoOrdemServico {
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
      const ordensBloqueadas = await transacao.$queryRaw<
        Array<{ identificador: string; status: StatusOrdemServico }>
      >`SELECT "identificador", "status"::text FROM "ordens_servico" WHERE "identificador" = ${composicao.ordemServicoId} FOR UPDATE`;
      if (ordensBloqueadas.length === 0) {
        throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
      }
      if (ordensBloqueadas[0].status !== StatusOrdemServico.EM_DIAGNOSTICO) {
        throw new ErroValidacao(
          'A composição só pode ser alterada durante o diagnóstico',
        );
      }

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
