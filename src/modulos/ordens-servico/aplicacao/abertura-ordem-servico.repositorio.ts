import { OrdemServico } from "../dominio/ordem-servico";

export const REPOSITORIO_ABERTURA_ORDEM_SERVICO = Symbol(
  "REPOSITORIO_ABERTURA_ORDEM_SERVICO",
);

export interface DadosPersistirAberturaOrdemServico {
  clienteId: string;
  descricao: string;
  veiculo: {
    placa: string;
    marca?: string;
    modelo?: string;
    ano?: number;
  };
}

export interface RepositorioAberturaOrdemServico {
  abrir(dadosEntrada: DadosPersistirAberturaOrdemServico): Promise<OrdemServico>;
}
