import { Body, Controller, Get, Headers, Param, Patch } from "@nestjs/common";
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { RotaPublica } from "../../autenticacao/apresentacao/rota-publica.decorador";
import { CasoUsoConsultarAcompanhamento } from "../aplicacao/consultar-acompanhamento.caso-uso";
import { CasoUsoDecidirOrcamentoAcompanhamento } from "../aplicacao/decidir-orcamento-acompanhamento.caso-uso";
import { DadosDecidirOrcamentoAcompanhamento } from "./acompanhamento.dto";

@ApiTags("acompanhamento")
@Controller("acompanhamento/ordens-servico")
export class ControladorAcompanhamento {
  constructor(
    private readonly consultarAcompanhamento: CasoUsoConsultarAcompanhamento,
    private readonly decidirOrcamento: CasoUsoDecidirOrcamentoAcompanhamento,
  ) {}

  @RotaPublica()
  @Get(":identificador")
  @ApiHeader({
    name: "X-Codigo-Acompanhamento",
    description: "Código privado fornecido na abertura da ordem de serviço",
    required: true,
  })
  @ApiOkResponse({ description: "Progresso da ordem de serviço" })
  @ApiNotFoundResponse({ description: "Ordem de serviço não encontrada" })
  consultar(
    @Param("identificador") identificador: string,
    @Headers("x-codigo-acompanhamento") codigoAcompanhamento?: string,
  ) {
    return this.consultarAcompanhamento.executar(
      identificador,
      codigoAcompanhamento,
    );
  }

  @RotaPublica()
  @Patch(":identificador/orcamento/decisao")
  @ApiHeader({
    name: "X-Codigo-Acompanhamento",
    description: "Código privado fornecido na abertura da ordem de serviço",
    required: true,
  })
  @ApiOkResponse({ description: "Decisão do orçamento registrada" })
  @ApiNotFoundResponse({ description: "Ordem de serviço não encontrada" })
  decidir(
    @Param("identificador") identificador: string,
    @Headers("x-codigo-acompanhamento") codigoAcompanhamento: string | undefined,
    @Body() dadosEntrada: DadosDecidirOrcamentoAcompanhamento,
  ) {
    return this.decidirOrcamento.executar(
      identificador,
      codigoAcompanhamento,
      dadosEntrada.decisao,
    );
  }
}
