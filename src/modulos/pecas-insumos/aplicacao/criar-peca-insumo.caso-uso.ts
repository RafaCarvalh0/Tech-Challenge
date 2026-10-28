import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { PecaInsumo } from '../dominio/peca-insumo';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';
import { SaidaPecaInsumo, paraSaidaPecaInsumo } from './peca-insumo.saida';

export interface EntradaCriarPecaInsumo {
  codigo: string;
  nome: string;
  descricao?: string;
  precoUnitarioEmCentavos: number;
  quantidadeEstoque?: number;
}

export class CasoUsoCriarPecaInsumo {
  constructor(private readonly pecasInsumos: RepositorioPecaInsumo) {}

  async executar(
    dadosEntrada: EntradaCriarPecaInsumo,
  ): Promise<SaidaPecaInsumo> {
    const pecaInsumo = PecaInsumo.criar(dadosEntrada);
    const registroExistente = await this.pecasInsumos.buscarPorCodigo(
      pecaInsumo.codigo,
    );
    if (registroExistente) {
      throw new ErroConflito('Peça ou insumo já cadastrado com este código');
    }

    await this.pecasInsumos.salvar(pecaInsumo);
    return paraSaidaPecaInsumo(pecaInsumo);
  }
}
