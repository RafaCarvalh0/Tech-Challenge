import { Veiculo } from '../dominio/veiculo';

export interface SaidaVeiculo {
  identificador: string;
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  criadoEm: Date;
}

export function paraSaidaVeiculo(veiculo: Veiculo): SaidaVeiculo {
  return {
    identificador: veiculo.identificador,
    clienteId: veiculo.clienteId,
    placa: veiculo.placa.valor,
    marca: veiculo.marca,
    modelo: veiculo.modelo,
    ano: veiculo.ano,
    criadoEm: veiculo.criadoEm,
  };
}
