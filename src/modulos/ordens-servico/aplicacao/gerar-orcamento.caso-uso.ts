import { RepositorioOrcamento } from './orcamento.repositorio';
import { SaidaOrcamento, paraSaidaOrcamento } from './orcamento.saida';

export class CasoUsoGerarOrcamento {
  constructor(private readonly orcamentos: RepositorioOrcamento) {}

  async executar(ordemServicoId: string): Promise<SaidaOrcamento> {
    const orcamento = await this.orcamentos.enviar(ordemServicoId);
    return paraSaidaOrcamento(orcamento);
  }
}
