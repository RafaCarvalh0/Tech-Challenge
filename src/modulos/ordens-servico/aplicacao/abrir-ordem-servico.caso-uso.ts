import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { RepositorioCliente } from '../../clientes/aplicacao/cliente.repositorio';
import { CpfCnpj } from '../../clientes/dominio/cpf-cnpj';
import { Placa } from '../../veiculos/dominio/placa';
import { SaidaOrdemServico, paraSaidaOrdemServico } from './ordem-servico.saida';
import { RepositorioAberturaOrdemServico } from './abertura-ordem-servico.repositorio';

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
    private readonly clientes: RepositorioCliente,
    private readonly aberturas: RepositorioAberturaOrdemServico,
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
    const ordemServico = await this.aberturas.abrir({
      clienteId: cliente.identificador,
      descricao: dadosEntrada.descricao,
      veiculo: { ...dadosEntrada.veiculo, placa: placa.valor },
    });

    return {
      ...paraSaidaOrdemServico(ordemServico),
      codigoAcompanhamento: ordemServico.codigoAcompanhamento,
    };
  }
}
