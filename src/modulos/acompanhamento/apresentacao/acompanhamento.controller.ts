import { Controller, Get, Headers, Param } from "@nestjs/common";
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { RotaPublica } from "../../autenticacao/apresentacao/rota-publica.decorador";
import { CasoUsoConsultarAcompanhamento } from "../aplicacao/consultar-acompanhamento.caso-uso";

@ApiTags("acompanhamento")
@Controller("acompanhamento/ordens-servico")
export class ControladorAcompanhamento {
  constructor(
    private readonly consultarAcompanhamento: CasoUsoConsultarAcompanhamento,
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
}
