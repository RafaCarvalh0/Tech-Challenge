import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { TipoMovimentacaoEstoque } from '../dominio/tipo-movimentacao-estoque';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';
import { SaidaPecaInsumo, paraSaidaPecaInsumo } from './peca-insumo.saida';

export class CasoUsoMovimentarEstoque {
  constructor(private readonly pecasInsumos: RepositorioPecaInsumo) {}

  async executar(
    identificador: string,
    tipo: TipoMovimentacaoEstoque,
    quantidade: number,
  ): Promise<SaidaPecaInsumo> {
    const pecaInsumo = await this.pecasInsumos.buscarPorId(identificador);
    if (!pecaInsumo) {
      throw new ErroNaoEncontrado('Peça ou insumo não encontrado');
    }

    const registroAtualizado = pecaInsumo.movimentarEstoque(tipo, quantidade);
    await this.pecasInsumos.atualizar(registroAtualizado);
    return paraSaidaPecaInsumo(registroAtualizado);
  }
}
