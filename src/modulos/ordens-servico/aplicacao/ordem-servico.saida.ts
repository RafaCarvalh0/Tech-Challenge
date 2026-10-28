import { OrdemServico } from '../dominio/ordem-servico';
import { StatusOrdemServico } from '../dominio/status-ordem-servico';
import { SaidaCliente } from '../../clientes/aplicacao/cliente.saida';
import { SaidaVeiculo } from '../../veiculos/aplicacao/veiculo.saida';
import { SaidaComposicaoOrdemServico } from './composicao-ordem-servico.saida';

export interface SaidaOrdemServico {
  identificador: string;
  clienteId: string;
  veiculoId: string;
  descricao: string;
  status: StatusOrdemServico;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface SaidaDetalheOrdemServico extends SaidaOrdemServico {
  cliente: SaidaCliente;
  veiculo: SaidaVeiculo;
  composicao: SaidaComposicaoOrdemServico | null;
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
