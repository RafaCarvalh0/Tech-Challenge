import { SaidaOrdemServico, paraSaidaOrdemServico } from './ordem-servico.saida';
import {
  FiltrosOrdemServico,
  RepositorioOrdemServico,
} from './ordem-servico.repositorio';

export class CasoUsoListarOrdensServico {
  constructor(private readonly ordensServico: RepositorioOrdemServico) {}

  async executar(
    filtros: FiltrosOrdemServico = {},
  ): Promise<SaidaOrdemServico[]> {
    const ordensServico = await this.ordensServico.listar(filtros);
    return ordensServico.map(paraSaidaOrdemServico);
  }
}
