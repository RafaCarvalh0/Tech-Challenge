import { Servico } from "../dominio/servico";

export interface SaidaServico {
  identificador: string;
  nome: string;
  descricao: string | null;
  precoEmCentavos: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

export function paraSaidaServico(servico: Servico): SaidaServico {
  return {
    identificador: servico.identificador,
    nome: servico.nome,
    descricao: servico.descricao,
    precoEmCentavos: servico.precoEmCentavos,
    criadoEm: servico.criadoEm,
    atualizadoEm: servico.atualizadoEm,
  };
}
