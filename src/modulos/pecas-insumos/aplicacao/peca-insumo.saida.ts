import { PecaInsumo } from '../dominio/peca-insumo';

export interface SaidaPecaInsumo {
  identificador: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  precoUnitarioEmCentavos: number;
  quantidadeEstoque: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

export function paraSaidaPecaInsumo(
  pecaInsumo: PecaInsumo,
): SaidaPecaInsumo {
  return {
    identificador: pecaInsumo.identificador,
    codigo: pecaInsumo.codigo,
    nome: pecaInsumo.nome,
    descricao: pecaInsumo.descricao,
    precoUnitarioEmCentavos: pecaInsumo.precoUnitarioEmCentavos,
    quantidadeEstoque: pecaInsumo.quantidadeEstoque,
    criadoEm: pecaInsumo.criadoEm,
    atualizadoEm: pecaInsumo.atualizadoEm,
  };
}
