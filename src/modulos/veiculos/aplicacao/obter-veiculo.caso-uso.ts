import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { SaidaVeiculo, paraSaidaVeiculo } from './veiculo.saida';
import { RepositorioVeiculo } from './veiculo.repositorio';

export class CasoUsoObterVeiculo {
  constructor(private readonly veiculos: RepositorioVeiculo) {}

  async executar(identificador: string): Promise<SaidaVeiculo> {
    const veiculo = await this.veiculos.buscarPorId(identificador);
    if (!veiculo) {
      throw new ErroNaoEncontrado('Veículo não encontrado');
    }

    return paraSaidaVeiculo(veiculo);
  }
}
