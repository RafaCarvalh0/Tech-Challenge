import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from '../../../compartilhado/dominio/erros';
import { SaidaCliente, paraSaidaCliente } from './cliente.saida';
import { RepositorioCliente } from './cliente.repositorio';

export interface EntradaAtualizarCliente {
  nome?: string;
  cpfCnpj?: string;
}

export class CasoUsoAtualizarCliente {
  constructor(private readonly clientes: RepositorioCliente) {}

  async executar(
    identificador: string,
    dadosEntrada: EntradaAtualizarCliente,
  ): Promise<SaidaCliente> {
    if (dadosEntrada.nome === undefined && dadosEntrada.cpfCnpj === undefined) {
      throw new ErroValidacao('Informe ao menos um campo para atualização');
    }

    const cliente = await this.clientes.buscarPorId(identificador);
    if (!cliente) {
      throw new ErroNaoEncontrado('Cliente não encontrado');
    }

    const clienteAtualizado = cliente.atualizar(dadosEntrada);
    const clienteMesmoDocumento = await this.clientes.buscarPorCpfCnpj(
      clienteAtualizado.cpfCnpj.valor,
    );
    if (
      clienteMesmoDocumento &&
      clienteMesmoDocumento.identificador !== cliente.identificador
    ) {
      throw new ErroConflito('Cliente já cadastrado para este CPF/CNPJ');
    }

    await this.clientes.atualizar(clienteAtualizado);
    return paraSaidaCliente(clienteAtualizado);
  }
}
