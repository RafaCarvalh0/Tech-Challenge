import { Prisma } from '@prisma/client';

import { ServicoPrisma } from '../../../banco-dados/prisma.servico';
import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { RepositorioOrcamento } from '../aplicacao/orcamento.repositorio';
import { AcaoOrdemServico } from '../dominio/acao-ordem-servico';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';
import { DecisaoOrcamento } from '../dominio/decisao-orcamento';
import { Orcamento } from '../dominio/orcamento';
import { OrdemServico } from '../dominio/ordem-servico';
import { SituacaoOrcamento } from '../dominio/situacao-orcamento';

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

  async enviar(ordemServicoId: string): Promise<Orcamento> {
    return this.servicoPrisma.$transaction(async (transacao) => {
      const ordemServico = await this.bloquearOrdemServico(
        transacao,
        ordemServicoId,
      );
      const composicao = await this.buscarComposicao(transacao, ordemServicoId);
      const orcamento = Orcamento.criar(composicao);
      const ordemAtualizada = ordemServico.executarAcao(
        AcaoOrdemServico.SOLICITAR_APROVACAO,
      );
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

      await transacao.orcamento.upsert({
        where: { ordemServicoId },
        create: { ordemServicoId, ...dadosOrcamento },
        update: dadosOrcamento,
      });
      await transacao.ordemServico.update({
        where: { identificador: ordemServicoId },
        data: {
          status: ordemAtualizada.status,
          atualizadoEm: ordemAtualizada.atualizadoEm,
        },
      });
      return orcamento;
    });
  }

  async decidir(
    ordemServicoId: string,
    decisao: DecisaoOrcamento,
  ): Promise<{ orcamento: Orcamento; ordemServico: OrdemServico }> {
    return this.servicoPrisma.$transaction(async (transacao) => {
      const ordemServico = await this.bloquearOrdemServico(
        transacao,
        ordemServicoId,
      );
      const registroOrcamento = await transacao.orcamento.findUnique({
        where: { ordemServicoId },
      });
      if (!registroOrcamento) {
        throw new ErroNaoEncontrado(
          'Orçamento da ordem de serviço não encontrado',
        );
      }

      const composicao = await this.buscarComposicao(transacao, ordemServicoId);
      const orcamentoAtualizado =
        Orcamento.restaurar(registroOrcamento).decidir(decisao);
      const acao =
        decisao === DecisaoOrcamento.APROVAR
          ? AcaoOrdemServico.APROVAR
          : AcaoOrdemServico.REJEITAR;
      const ordemAtualizada = ordemServico.executarAcao(acao);

      if (orcamentoAtualizado.situacao === SituacaoOrcamento.APROVADO) {
        for (const item of composicao.pecasInsumos) {
          const resultado = await transacao.pecaInsumo.updateMany({
            where: {
              identificador: item.pecaInsumoId,
              quantidadeEstoque: { gte: item.quantidade },
            },
            data: {
              quantidadeEstoque: { decrement: item.quantidade },
              atualizadoEm: orcamentoAtualizado.atualizadoEm,
            },
          });
          if (resultado.count !== 1) {
            throw new ErroValidacao(`Estoque insuficiente para ${item.codigo}`);
          }
        }
      }

      await transacao.orcamento.update({
        where: { identificador: orcamentoAtualizado.identificador },
        data: {
          situacao: orcamentoAtualizado.situacao,
          decididoEm: orcamentoAtualizado.decididoEm,
          atualizadoEm: orcamentoAtualizado.atualizadoEm,
        },
      });
      await transacao.ordemServico.update({
        where: { identificador: ordemServicoId },
        data: {
          status: ordemAtualizada.status,
          atualizadoEm: ordemAtualizada.atualizadoEm,
        },
      });

      return {
        orcamento: orcamentoAtualizado,
        ordemServico: ordemAtualizada,
      };
    });
  }

  private async bloquearOrdemServico(
    transacao: Prisma.TransactionClient,
    ordemServicoId: string,
  ): Promise<OrdemServico> {
    const ordensBloqueadas = await transacao.$queryRaw<
      Array<{ identificador: string }>
    >`SELECT "identificador" FROM "ordens_servico" WHERE "identificador" = ${ordemServicoId} FOR UPDATE`;
    if (ordensBloqueadas.length === 0) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }

    const registro = await transacao.ordemServico.findUnique({
      where: { identificador: ordemServicoId },
    });
    if (!registro) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }
    return OrdemServico.restaurar(registro);
  }

  private async buscarComposicao(
    transacao: Prisma.TransactionClient,
    ordemServicoId: string,
  ): Promise<ComposicaoOrdemServico> {
    const [servicos, pecasInsumos] = await Promise.all([
      transacao.itemServicoOrdem.findMany({ where: { ordemServicoId } }),
      transacao.itemPecaInsumoOrdem.findMany({ where: { ordemServicoId } }),
    ]);
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
}
