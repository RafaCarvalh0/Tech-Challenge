import { SaidaCliente, paraSaidaCliente } from './cliente.saida';
import { RepositorioCliente } from './cliente.repositorio';

export class CasoUsoListarClientes {
  constructor(private readonly clientes: RepositorioCliente) {}

  async executar(): Promise<SaidaCliente[]> {
    const clientes = await this.clientes.listar();
    return clientes.map(paraSaidaCliente);
  }
}
