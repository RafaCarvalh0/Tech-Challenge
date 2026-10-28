import { CasoUsoObterTempoMedioServicos } from "./obter-tempo-medio-servicos.caso-uso";
import {
  IndicadorTempoMedioServico,
  RepositorioIndicadorTempoMedio,
} from "./indicador-tempo-medio.repositorio";

class RepositorioIndicadorTempoMedioEmMemoria
  implements RepositorioIndicadorTempoMedio
{
  constructor(
    private readonly indicadores: IndicadorTempoMedioServico[] = [],
  ) {}

  async obterPorServico(): Promise<IndicadorTempoMedioServico[]> {
    return this.indicadores;
  }
}

describe("Obtenção do tempo médio dos serviços", () => {
  it("retorna uma lista vazia quando não existem serviços finalizados", async () => {
    const casoUso = new CasoUsoObterTempoMedioServicos(
      new RepositorioIndicadorTempoMedioEmMemoria(),
    );

    await expect(casoUso.executar()).resolves.toEqual([]);
  });

  it("retorna os dados agregados por serviço", async () => {
    const indicadores: IndicadorTempoMedioServico[] = [
      {
        servicoId: "servico-1",
        nome: "Troca de óleo",
        quantidadeOrdens: 2,
        tempoMedioExecucaoEmSegundos: 5400,
      },
    ];
    const casoUso = new CasoUsoObterTempoMedioServicos(
      new RepositorioIndicadorTempoMedioEmMemoria(indicadores),
    );

    await expect(casoUso.executar()).resolves.toEqual([
      {
        servicoId: "servico-1",
        nome: "Troca de óleo",
        quantidadeOrdens: 2,
        tempoMedioExecucaoEmSegundos: 5400,
      },
    ]);
  });
});
