import { ErroConflito } from '../../../compartilhado/dominio/erros';
import { Cliente } from '../dominio/cliente';
import { SaidaCliente, paraSaidaCliente } from './cliente.saida';
import { RepositorioCliente } from './cliente.repositorio';

export interface EntradaCriarCliente {
  nome: string;
  cpfCnpj: string;
}

export class CasoUsoCriarCliente {
  constructor(private readonly clientes: RepositorioCliente) {}

  async executar(dadosEntrada: EntradaCriarCliente): Promise<SaidaCliente> {
    const cliente = Cliente.criar(dadosEntrada);
    const clienteExistente = await this.clientes.buscarPorCpfCnpj(cliente.cpfCnpj.valor);

    if (clienteExistente) {
      throw new ErroConflito('Cliente já cadastrado para este CPF/CNPJ');
    }

    await this.clientes.salvar(cliente);
    return paraSaidaCliente(cliente);
  }
}
