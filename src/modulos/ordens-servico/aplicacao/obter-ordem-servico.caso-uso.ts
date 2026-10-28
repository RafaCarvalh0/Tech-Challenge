import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { paraSaidaCliente } from '../../clientes/aplicacao/cliente.saida';
import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { paraSaidaVeiculo } from '../../veiculos/aplicacao/veiculo.saida';
import { RepositorioVeiculo } from '../../veiculos/aplicacao/veiculo.repositorio';
import {
  SaidaDetalheOrdemServico,
  paraSaidaOrdemServico,
} from './ordem-servico.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export class CasoUsoObterOrdemServico {
  constructor(
    private readonly ordensServico: RepositorioOrdemServico,
    private readonly clientes: RepositorioCliente,
    private readonly veiculos: RepositorioVeiculo,
  ) {}

  async executar(identificador: string): Promise<SaidaDetalheOrdemServico> {
    const ordemServico = await this.ordensServico.buscarPorId(identificador);
    if (!ordemServico) {
      throw new ErroNaoEncontrado('Ordem de serviço não encontrada');
    }

    const [cliente, veiculo] = await Promise.all([
      this.clientes.buscarPorId(ordemServico.clienteId),
      this.veiculos.buscarPorId(ordemServico.veiculoId),
    ]);
    if (!cliente || !veiculo) {
      throw new ErroNaoEncontrado(
        'Cliente ou veículo vinculado à ordem de serviço não encontrado',
      );
    }

    return {
      ...paraSaidaOrdemServico(ordemServico),
      cliente: paraSaidaCliente(cliente),
      veiculo: paraSaidaVeiculo(veiculo),
    };
  }
}
