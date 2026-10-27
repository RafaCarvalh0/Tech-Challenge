import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { RepositorioVeiculo } from './veiculo.repositorio';

export class CasoUsoExcluirVeiculo {
  constructor(private readonly veiculos: RepositorioVeiculo) {}

  async executar(identificador: string): Promise<void> {
    const veiculo = await this.veiculos.buscarPorId(identificador);
    if (!veiculo) {
      throw new ErroNaoEncontrado('Veículo não encontrado');
    }
    await this.veiculos.excluir(identificador);
  }
}
