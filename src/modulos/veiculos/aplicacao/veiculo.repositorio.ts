import { Veiculo } from '../dominio/veiculo';

export const REPOSITORIO_VEICULO = Symbol('REPOSITORIO_VEICULO');

export interface RepositorioVeiculo {
  buscarPorId(identificador: string): Promise<Veiculo | null>;
  buscarPorPlaca(placa: string): Promise<Veiculo | null>;
  salvar(veiculo: Veiculo): Promise<void>;
}
