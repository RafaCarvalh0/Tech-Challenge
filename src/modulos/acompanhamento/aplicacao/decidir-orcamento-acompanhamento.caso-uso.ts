import { CasoUsoDecidirOrcamento } from "../../ordens-servico/aplicacao/decidir-orcamento.caso-uso";
import { DecisaoOrcamento } from "../../ordens-servico/dominio/decisao-orcamento";
import { CasoUsoConsultarAcompanhamento } from "./consultar-acompanhamento.caso-uso";

export class CasoUsoDecidirOrcamentoAcompanhamento {
  constructor(
    private readonly consultarAcompanhamento: CasoUsoConsultarAcompanhamento,
    private readonly decidirOrcamento: CasoUsoDecidirOrcamento,
  ) {}

  async executar(
    identificador: string,
    codigoAcompanhamento: string | undefined,
    decisao: DecisaoOrcamento,
  ) {
    await this.consultarAcompanhamento.executar(
      identificador,
      codigoAcompanhamento,
    );
    await this.decidirOrcamento.executar(identificador, decisao);
    return this.consultarAcompanhamento.executar(
      identificador,
      codigoAcompanhamento,
    );
  }
}
