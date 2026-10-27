import { SaidaVeiculo, paraSaidaVeiculo } from './veiculo.saida';
import { RepositorioVeiculo } from './veiculo.repositorio';

export class CasoUsoListarVeiculos {
  constructor(private readonly veiculos: RepositorioVeiculo) {}

  async executar(clienteId?: string): Promise<SaidaVeiculo[]> {
    const veiculos = await this.veiculos.listar(clienteId);
    return veiculos.map(paraSaidaVeiculo);
  }
}
