import {
  IndicadorTempoMedioServico,
  RepositorioIndicadorTempoMedio,
} from "./indicador-tempo-medio.repositorio";

export class CasoUsoObterTempoMedioServicos {
  constructor(
    private readonly repositorioIndicador: RepositorioIndicadorTempoMedio,
  ) {}

  executar(): Promise<IndicadorTempoMedioServico[]> {
    return this.repositorioIndicador.obterPorServico();
  }
}
