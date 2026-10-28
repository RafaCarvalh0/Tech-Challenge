import { ErroNaoEncontrado } from '../../../compartilhado/dominio/erros';
import { RepositorioCliente } from './cliente.repositorio';

export class CasoUsoExcluirCliente {
  constructor(private readonly clientes: RepositorioCliente) {}

  async executar(identificador: string): Promise<void> {
    const cliente = await this.clientes.buscarPorId(identificador);
    if (!cliente) {
      throw new ErroNaoEncontrado('Cliente não encontrado');
    }
    await this.clientes.excluir(identificador);
  }
}
