import { OrdemServico } from '../dominio/ordem-servico';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';

export interface SaidaOrdemServico {
  identificador: string;
  clienteId: string;
  veiculoId: string;
  descricao: string;
  status: StatusOrdemServico;
  criadoEm: Date;
  atualizadoEm: Date;
}

export function paraSaidaOrdemServico(ordemServico: OrdemServico): SaidaOrdemServico {
  return {
    identificador: ordemServico.identificador,
    clienteId: ordemServico.clienteId,
    veiculoId: ordemServico.veiculoId,
    descricao: ordemServico.descricao,
    status: ordemServico.status,
    criadoEm: ordemServico.criadoEm,
    atualizadoEm: ordemServico.atualizadoEm,
  };
}
