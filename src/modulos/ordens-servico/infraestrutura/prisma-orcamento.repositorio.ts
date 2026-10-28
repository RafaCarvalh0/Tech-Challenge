import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import { RepositorioOrcamento } from '../aplicacao/orcamento.repositorio';
import { Orcamento } from '../dominio/orcamento';
import { OrdemServico } from '../dominio/ordem-servico';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';
import { SituacaoOrcamento } from '../dominio/situacao-orcamento';
import { ErroValidacao } from '../../../compartilhado/dominio/erros';

export class RepositorioPrismaOrcamento implements RepositorioOrcamento {
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async buscarPorOrdemServicoId(
    ordemServicoId: string,
  ): Promise<Orcamento | null> {
    const registro = await this.servicoPrisma.orcamento.findUnique({
      where: { ordemServicoId },
    });
    return registro ? Orcamento.restaurar(registro) : null;
  }

  async enviar(
    orcamento: Orcamento,
    ordemServico: OrdemServico,
  ): Promise<void> {
    const dadosOrcamento = {
      identificador: orcamento.identificador,
      subtotalServicosEmCentavos: orcamento.subtotalServicosEmCentavos,
      subtotalPecasInsumosEmCentavos:
        orcamento.subtotalPecasInsumosEmCentavos,
      totalEmCentavos: orcamento.totalEmCentavos,
      situacao: orcamento.situacao,
      geradoEm: orcamento.geradoEm,
      atualizadoEm: orcamento.atualizadoEm,
      decididoEm: orcamento.decididoEm,
    };

    await this.servicoPrisma.$transaction([
      this.servicoPrisma.orcamento.upsert({
        where: { ordemServicoId: orcamento.ordemServicoId },
        create: {
          ordemServicoId: orcamento.ordemServicoId,
          ...dadosOrcamento,
        },
        update: dadosOrcamento,
      }),
      this.servicoPrisma.ordemServico.update({
        where: { identificador: ordemServico.identificador },
        data: {
          status: ordemServico.status,
          atualizadoEm: ordemServico.atualizadoEm,
        },
      }),
    ]);
  }

  async decidir(
    orcamento: Orcamento,
    ordemServico: OrdemServico,
    composicao: ComposicaoOrdemServico,
  ): Promise<void> {
    await this.servicoPrisma.$transaction(async (transacao) => {
      if (orcamento.situacao === SituacaoOrcamento.APROVADO) {
        for (const item of composicao.pecasInsumos) {
          const resultado = await transacao.pecaInsumo.updateMany({
            where: {
              identificador: item.pecaInsumoId,
              quantidadeEstoque: { gte: item.quantidade },
            },
            data: {
              quantidadeEstoque: { decrement: item.quantidade },
              atualizadoEm: orcamento.atualizadoEm,
            },
          });
          if (resultado.count !== 1) {
            throw new ErroValidacao(
              `Estoque insuficiente para ${item.codigo}`,
            );
          }
        }
      }

      await transacao.orcamento.update({
        where: { identificador: orcamento.identificador },
        data: {
          situacao: orcamento.situacao,
          decididoEm: orcamento.decididoEm,
          atualizadoEm: orcamento.atualizadoEm,
        },
      });
      await transacao.ordemServico.update({
        where: { identificador: ordemServico.identificador },
        data: {
          status: ordemServico.status,
          atualizadoEm: ordemServico.atualizadoEm,
        },
      });
    });
  }
}
