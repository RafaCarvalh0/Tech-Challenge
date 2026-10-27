import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { SaidaCliente, paraSaidaCliente } from './cliente.saida';
import { RepositorioCliente } from './cliente.repositorio';

export class CasoUsoObterCliente {
  constructor(private readonly clientes: RepositorioCliente) {}

  async executar(identificador: string): Promise<SaidaCliente> {
    const cliente = await this.clientes.buscarPorId(identificador);

    if (!cliente) {
      throw new ErroNaoEncontrado('Cliente não encontrado');
    }

    return paraSaidaCliente(cliente);
  }
}
