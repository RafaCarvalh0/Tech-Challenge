import { DecisaoOrcamento } from '../dominio/decisao-orcamento';
import { RepositorioOrcamento } from './orcamento.repositorio';
import { SaidaOrcamento, paraSaidaOrcamento } from './orcamento.saida';
import {
  SaidaOrdemServico,
  paraSaidaOrdemServico,
} from './ordem-servico.saida';

export interface SaidaDecisaoOrcamento {
  ordemServico: SaidaOrdemServico;
  orcamento: SaidaOrcamento;
}

export class CasoUsoDecidirOrcamento {
  constructor(private readonly orcamentos: RepositorioOrcamento) {}

  async executar(
    ordemServicoId: string,
    decisao: DecisaoOrcamento,
  ): Promise<SaidaDecisaoOrcamento> {
    const resultado = await this.orcamentos.decidir(ordemServicoId, decisao);

    return {
      ordemServico: paraSaidaOrdemServico(resultado.ordemServico),
      orcamento: paraSaidaOrcamento(resultado.orcamento),
    };
  }
}
