import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { ErroConflito, ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { Veiculo } from '../dominio/veiculo';
import { SaidaVeiculo, paraSaidaVeiculo } from './veiculo.saida';
import { RepositorioVeiculo } from './veiculo.repositorio';

export interface EntradaCriarVeiculo {
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
}

export class CasoUsoCriarVeiculo {
  constructor(
    private readonly veiculos: RepositorioVeiculo,
    private readonly clientes: RepositorioCliente,
  ) {}

  async executar(dadosEntrada: EntradaCriarVeiculo): Promise<SaidaVeiculo> {
    const cliente = await this.clientes.buscarPorId(dadosEntrada.clienteId);
    if (!cliente) {
      throw new ErroNaoEncontrado('Cliente não encontrado');
    }

    const veiculo = Veiculo.criar(dadosEntrada);
    const veiculoExistente = await this.veiculos.buscarPorPlaca(veiculo.placa.valor);
    if (veiculoExistente) {
      throw new ErroConflito('Veículo já cadastrado para esta placa');
    }

    await this.veiculos.salvar(veiculo);
    return paraSaidaVeiculo(veiculo);
  }
}
