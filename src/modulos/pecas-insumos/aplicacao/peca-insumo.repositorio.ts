import { PecaInsumo } from '../dominio/peca-insumo';

export const REPOSITORIO_PECA_INSUMO = Symbol('REPOSITORIO_PECA_INSUMO');

export interface RepositorioPecaInsumo {
  buscarPorId(identificador: string): Promise<PecaInsumo | null>;
  buscarPorCodigo(codigo: string): Promise<PecaInsumo | null>;
  listar(): Promise<PecaInsumo[]>;
  salvar(pecaInsumo: PecaInsumo): Promise<void>;
  atualizar(pecaInsumo: PecaInsumo): Promise<void>;
  excluir(identificador: string): Promise<void>;
}
