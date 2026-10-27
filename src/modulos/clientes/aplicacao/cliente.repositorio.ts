import { Cliente } from '../dominio/cliente';

export const REPOSITORIO_CLIENTE = Symbol('REPOSITORIO_CLIENTE');

export interface RepositorioCliente {
  buscarPorId(identificador: string): Promise<Cliente | null>;
  buscarPorCpfCnpj(cpfCnpj: string): Promise<Cliente | null>;
  listar(): Promise<Cliente[]>;
  salvar(cliente: Cliente): Promise<void>;
  atualizar(cliente: Cliente): Promise<void>;
  excluir(identificador: string): Promise<void>;
}
