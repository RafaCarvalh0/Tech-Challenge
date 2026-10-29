import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { DecisaoOrcamento } from "../../ordens-servico/dominio/decisao-orcamento";

export class DadosDecidirOrcamentoAcompanhamento {
  @ApiProperty({ enum: DecisaoOrcamento, example: DecisaoOrcamento.APROVAR })
  @IsEnum(DecisaoOrcamento)
  decisao!: DecisaoOrcamento;
}
