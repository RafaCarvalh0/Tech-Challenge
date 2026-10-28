import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';

export class CasoUsoExcluirPecaInsumo {
  constructor(private readonly pecasInsumos: RepositorioPecaInsumo) {}

  async executar(identificador: string): Promise<void> {
    const pecaInsumo = await this.pecasInsumos.buscarPorId(identificador);
    if (!pecaInsumo) {
      throw new ErroNaoEncontrado('Peça ou insumo não encontrado');
    }
    await this.pecasInsumos.excluir(identificador);
  }
}
