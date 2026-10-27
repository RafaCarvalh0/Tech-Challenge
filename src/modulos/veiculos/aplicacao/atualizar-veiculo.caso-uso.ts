import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { SaidaVeiculo, paraSaidaVeiculo } from './veiculo.saida';
import { RepositorioVeiculo } from './veiculo.repositorio';

export interface EntradaAtualizarVeiculo {
  placa?: string;
  marca?: string;
  modelo?: string;
  ano?: number;
}

export class CasoUsoAtualizarVeiculo {
  constructor(private readonly veiculos: RepositorioVeiculo) {}

  async executar(
    identificador: string,
    dadosEntrada: EntradaAtualizarVeiculo,
  ): Promise<SaidaVeiculo> {
    if (Object.values(dadosEntrada).every((valor) => valor === undefined)) {
      throw new ErroValidacao('Informe ao menos um campo para atualização');
    }

    const veiculo = await this.veiculos.buscarPorId(identificador);
    if (!veiculo) {
      throw new ErroNaoEncontrado('Veículo não encontrado');
    }

    const veiculoAtualizado = veiculo.atualizar(dadosEntrada);
    const veiculoMesmaPlaca = await this.veiculos.buscarPorPlaca(
      veiculoAtualizado.placa.valor,
    );
    if (
      veiculoMesmaPlaca &&
      veiculoMesmaPlaca.identificador !== veiculo.identificador
    ) {
      throw new ErroConflito('Veículo já cadastrado para esta placa');
    }

    await this.veiculos.atualizar(veiculoAtualizado);
    return paraSaidaVeiculo(veiculoAtualizado);
  }
}
