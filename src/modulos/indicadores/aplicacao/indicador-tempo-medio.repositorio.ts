export interface IndicadorTempoMedioServico {
  servicoId: string;
  nome: string;
  quantidadeOrdens: number;
  tempoMedioExecucaoEmSegundos: number;
}

export interface RepositorioIndicadorTempoMedio {
  obterPorServico(): Promise<IndicadorTempoMedioServico[]>;
}

export const REPOSITORIO_INDICADOR_TEMPO_MEDIO = Symbol(
  "REPOSITORIO_INDICADOR_TEMPO_MEDIO",
);
