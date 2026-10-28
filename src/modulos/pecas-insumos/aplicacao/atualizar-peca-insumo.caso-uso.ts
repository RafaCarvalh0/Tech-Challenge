import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { RepositorioPecaInsumo } from './peca-insumo.repositorio';
import { SaidaPecaInsumo, paraSaidaPecaInsumo } from './peca-insumo.saida';

export interface EntradaAtualizarPecaInsumo {
  codigo?: string;
  nome?: string;
  descricao?: string | null;
  precoUnitarioEmCentavos?: number;
}

export class CasoUsoAtualizarPecaInsumo {
  constructor(private readonly pecasInsumos: RepositorioPecaInsumo) {}

  async executar(
    identificador: string,
    dadosEntrada: EntradaAtualizarPecaInsumo,
  ): Promise<SaidaPecaInsumo> {
    if (
      dadosEntrada.codigo === undefined &&
      dadosEntrada.nome === undefined &&
      dadosEntrada.descricao === undefined &&
      dadosEntrada.precoUnitarioEmCentavos === undefined
    ) {
      throw new ErroValidacao('Informe ao menos um campo para atualização');
    }

    const pecaInsumo = await this.pecasInsumos.buscarPorId(identificador);
    if (!pecaInsumo) {
      throw new ErroNaoEncontrado('Peça ou insumo não encontrado');
    }

    const registroAtualizado = pecaInsumo.atualizar(dadosEntrada);
    const registroMesmoCodigo = await this.pecasInsumos.buscarPorCodigo(
      registroAtualizado.codigo,
    );
    if (
      registroMesmoCodigo &&
      registroMesmoCodigo.identificador !== pecaInsumo.identificador
    ) {
      throw new ErroConflito('Peça ou insumo já cadastrado com este código');
    }

    await this.pecasInsumos.atualizar(registroAtualizado);
    return paraSaidaPecaInsumo(registroAtualizado);
  }
}
