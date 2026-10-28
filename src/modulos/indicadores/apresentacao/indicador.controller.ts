import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { CasoUsoObterTempoMedioServicos } from "../aplicacao/obter-tempo-medio-servicos.caso-uso";

@ApiTags("indicadores")
@ApiBearerAuth()
@Controller("indicadores")
export class ControladorIndicador {
  constructor(
    private readonly obterTempoMedioServicos: CasoUsoObterTempoMedioServicos,
  ) {}

  @Get("tempo-medio-servicos")
  @ApiOkResponse({
    description: "Tempo médio de execução agrupado por serviço",
  })
  obterPorServico() {
    return this.obterTempoMedioServicos.executar();
  }
}
