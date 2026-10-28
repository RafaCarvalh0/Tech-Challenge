import {
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { RepositorioPecaInsumo } from '../../pecas-insumos/aplicacao/peca-insumo.repositorio';
import { RepositorioServico } from '../../servicos/aplicacao/servico.repositorio';
import { ComposicaoOrdemServico } from '../dominio/composicao-ordem-servico';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { RepositorioComposicaoOrdemServico } from './composicao-ordem-servico.repositorio';
import {
  SaidaComposicaoOrdemServico,
  paraSaidaComposicaoOrdemServico,
} from './composicao-ordem-servico.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export interface EntradaDefinirComposicao {
  servicos: Array<{ servicoId: string; quantidade: number }>;
  pecasInsumos: Array<{ pecaInsumoId: string; quantidade: number }>;
}

export class CasoUsoDefinirComposicaoOrdemServico {
  constructor(
    private readonly ordensServico: RepositorioOrdemServico,
    private readonly composicoes: RepositorioComposicaoOrdemServico,
    private readonly servicos: RepositorioServico,
    private readonly pecasInsumos: RepositorioPecaInsumo,
  ) {}

  async executar(
    ordemServicoId: string,
    dadosEntrada: EntradaDefinirComposicao,
  ): Promise<SaidaComposicaoOrdemServico> {
    const ordemServico = await this.ordensServico.buscarPorId(ordemServicoId);
    if (!ordemServico) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }
    if (ordemServico.status !== StatusOrdemServico.EM_DIAGNOSTICO) {
      throw new ErroValidacao(
        'A composição só pode ser alterada durante o diagnóstico',
      );
    }

    const servicos = await Promise.all(
      dadosEntrada.servicos.map(async (item) => {
        const servico = await this.servicos.buscarPorId(item.servicoId);
        if (!servico) {
          throw new ErroNaoEncontrado('Serviço não encontrado');
        }
        return { servico, quantidade: item.quantidade };
      }),
    );
    const pecasInsumos = await Promise.all(
      dadosEntrada.pecasInsumos.map(async (item) => {
        const pecaInsumo = await this.pecasInsumos.buscarPorId(
          item.pecaInsumoId,
        );
        if (!pecaInsumo) {
          throw new ErroNaoEncontrado('Peça ou insumo não encontrado');
        }
        if (pecaInsumo.quantidadeEstoque < item.quantidade) {
          throw new ErroValidacao(
            `Estoque insuficiente para ${pecaInsumo.codigo}`,
          );
        }
        return { pecaInsumo, quantidade: item.quantidade };
      }),
    );

    const composicao = ComposicaoOrdemServico.criar({
      ordemServicoId,
      servicos,
      pecasInsumos,
    });
    await this.composicoes.substituir(composicao);
    return paraSaidaComposicaoOrdemServico(composicao);
  }
}
