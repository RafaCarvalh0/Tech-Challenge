import { Servico } from "../dominio/servico";

export const REPOSITORIO_SERVICO = Symbol("REPOSITORIO_SERVICO");

export interface RepositorioServico {
  buscarPorId(identificador: string): Promise<Servico | null>;
  buscarPorNome(nome: string): Promise<Servico | null>;
  listar(): Promise<Servico[]>;
  salvar(servico: Servico): Promise<void>;
  atualizar(servico: Servico): Promise<void>;
  excluir(identificador: string): Promise<void>;
}
