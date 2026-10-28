import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';
import { SaidaPecaInsumo, paraSaidaPecaInsumo } from './peca-insumo.saida';

export class CasoUsoObterPecaInsumo {
  constructor(private readonly pecasInsumos: RepositorioPecaInsumo) {}

  async executar(identificador: string): Promise<SaidaPecaInsumo> {
    const pecaInsumo = await this.pecasInsumos.buscarPorId(identificador);
    if (!pecaInsumo) {
      throw new ErroNaoEncontrado('Peça ou insumo não encontrado');
    }
    return paraSaidaPecaInsumo(pecaInsumo);
  }
}
