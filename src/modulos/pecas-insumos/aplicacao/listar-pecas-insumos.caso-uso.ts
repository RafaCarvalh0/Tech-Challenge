import { RepositorioPecaInsumo } from './peca-insumo.repositorio';
import { SaidaPecaInsumo, paraSaidaPecaInsumo } from './peca-insumo.saida';

export class CasoUsoListarPecasInsumos {
  constructor(private readonly pecasInsumos: RepositorioPecaInsumo) {}

  async executar(): Promise<SaidaPecaInsumo[]> {
    const pecasInsumos = await this.pecasInsumos.listar();
    return pecasInsumos.map(paraSaidaPecaInsumo);
  }
}
