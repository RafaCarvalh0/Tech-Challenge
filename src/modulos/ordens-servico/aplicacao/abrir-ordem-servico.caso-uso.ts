import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { CpfCnpj } from '../../clientes/dominio/cpf-cnpj';
import { RepositorioVeiculo } from '../../veiculos/aplicacao/veiculo.repositorio';
import { Placa } from '../../veiculos/dominio/placa';
import { Veiculo } from '../../veiculos/dominio/veiculo';
import { OrdemServico } from '../dominio/ordem-servico';
import { SaidaOrdemServico, paraSaidaOrdemServico } from './ordem-servico.saida';
import { RepositorioOrdemServico } from './ordem-servico.repositorio';

export interface EntradaAbrirOrdemServico {
  cpfCnpj: string;
  descricao: string;
  veiculo: {
    placa: string;
    marca?: string;
    modelo?: string;
    ano?: number;
  };
}

export interface SaidaAberturaOrdemServico extends SaidaOrdemServico {
  codigoAcompanhamento: string;
}

export class CasoUsoAbrirOrdemServico {
  constructor(
    private readonly ordensServico: RepositorioOrdemServico,
    private readonly clientes: RepositorioCliente,
    private readonly veiculos: RepositorioVeiculo,
  ) {}

  async executar(
    dadosEntrada: EntradaAbrirOrdemServico,
  ): Promise<SaidaAberturaOrdemServico> {
    const cpfCnpj = CpfCnpj.criar(dadosEntrada.cpfCnpj);
    const cliente = await this.clientes.buscarPorCpfCnpj(cpfCnpj.valor);
    if (!cliente) {
      throw new ErroNaoEncontrado('Cliente não encontrado para o CPF/CNPJ');
    }

    const placa = Placa.criar(dadosEntrada.veiculo.placa);
    let veiculo = await this.veiculos.buscarPorPlaca(placa.valor);
    let veiculoCriadoNoFluxo = false;

    if (veiculo && veiculo.clienteId !== cliente.identificador) {
      throw new ErroConflito('Veículo pertence a outro cliente');
    }

    if (!veiculo) {
      const { marca, modelo, ano } = dadosEntrada.veiculo;
      if (marca === undefined || modelo === undefined || ano === undefined) {
        throw new ErroValidacao(
          'Marca, modelo e ano são obrigatórios para cadastrar um veículo novo',
        );
      }
      veiculo = Veiculo.criar({
        clienteId: cliente.identificador,
        placa: placa.valor,
        marca,
        modelo,
        ano,
      });
      await this.veiculos.salvar(veiculo);
      veiculoCriadoNoFluxo = true;
    }

    const ordemServico = OrdemServico.criar({
      clienteId: cliente.identificador,
      veiculoId: veiculo.identificador,
      descricao: dadosEntrada.descricao,
    });

    try {
      await this.ordensServico.salvar(ordemServico);
    } catch (error_) {
      if (veiculoCriadoNoFluxo) {
        await this.veiculos.excluir(veiculo.identificador);
      }
      throw error_;
    }

    return {
      ...paraSaidaOrdemServico(ordemServico),
      codigoAcompanhamento: ordemServico.codigoAcompanhamento,
    };
  }
}
