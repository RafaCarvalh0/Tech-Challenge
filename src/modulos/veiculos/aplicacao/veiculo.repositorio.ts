import { Veiculo } from '../dominio/veiculo';

export const REPOSITORIO_VEICULO = Symbol('REPOSITORIO_VEICULO');

export interface RepositorioVeiculo {
  buscarPorId(identificador: string): Promise<Veiculo | null>;
  buscarPorPlaca(placa: string): Promise<Veiculo | null>;
  listar(clienteId?: string): Promise<Veiculo[]>;
  salvar(veiculo: Veiculo): Promise<void>;
  atualizar(veiculo: Veiculo): Promise<void>;
  excluir(identificador: string): Promise<void>;
}
