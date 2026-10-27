import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { RepositorioVeiculo } from '../../veiculos/aplicacao/veiculo.repositorio';
import { ErroNaoEncontrado, ErroValidacao } from '../../../compartilhado/dominio/erros';
import { OrdemServico } from '../dominio/ordem-servico';
import { SaidaOrdemServico, paraSaidaOrdemServico } from './ordem-servico.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export interface EntradaCriarOrdemServico {
  clienteId: string;
  veiculoId: string;
  descricao: string;
}

export class CasoUsoCriarOrdemServico {
  constructor(
    private readonly ordensServico: RepositorioOrdemServico,
    private readonly clientes: RepositorioCliente,
    private readonly veiculos: RepositorioVeiculo,
  ) {}

  async executar(dadosEntrada: EntradaCriarOrdemServico): Promise<SaidaOrdemServico> {
    const cliente = await this.clientes.buscarPorId(dadosEntrada.clienteId);
    if (!cliente) {
      throw new ErroNaoEncontrado('Cliente não encontrado');
    }

    const veiculo = await this.veiculos.buscarPorId(dadosEntrada.veiculoId);
    if (!veiculo) {
      throw new ErroNaoEncontrado('Veículo não encontrado');
    }

    if (veiculo.clienteId !== cliente.identificador) {
      throw new ErroValidacao('Veículo não pertence ao cliente informado');
    }

    const ordemServico = OrdemServico.criar(dadosEntrada);
    await this.ordensServico.salvar(ordemServico);
    return paraSaidaOrdemServico(ordemServico);
  }
}
