import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CasoUsoAtualizarServico } from "../aplicacao/atualizar-servico.caso-uso";
import { CasoUsoCriarServico } from "../aplicacao/criar-servico.caso-uso";
import { CasoUsoExcluirServico } from "../aplicacao/excluir-servico.caso-uso";
import { CasoUsoListarServicos } from "../aplicacao/listar-servicos.caso-uso";
import { CasoUsoObterServico } from "../aplicacao/obter-servico.caso-uso";
import { DadosAtualizarServico, DadosCriarServico } from "./servico.dto";

@ApiTags("serviços")
@Controller("servicos")
export class ControladorServico {
  constructor(
    private readonly criarServico: CasoUsoCriarServico,
    private readonly obterServico: CasoUsoObterServico,
    private readonly listarServicos: CasoUsoListarServicos,
    private readonly atualizarServico: CasoUsoAtualizarServico,
    private readonly excluirServico: CasoUsoExcluirServico,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: "Serviço cadastrado" })
  @ApiConflictResponse({ description: "Nome já cadastrado" })
  criar(@Body() dadosEntrada: DadosCriarServico) {
    return this.criarServico.executar(dadosEntrada);
  }

  @Get()
  @ApiOkResponse({ description: "Serviços listados" })
  listar() {
    return this.listarServicos.executar();
  }

  @Get(":identificador")
  @ApiOkResponse({ description: "Serviço encontrado" })
  @ApiNotFoundResponse({ description: "Serviço não encontrado" })
  buscarPorId(@Param("identificador") identificador: string) {
    return this.obterServico.executar(identificador);
  }

  @Patch(":identificador")
  @ApiOkResponse({ description: "Serviço atualizado" })
  @ApiNotFoundResponse({ description: "Serviço não encontrado" })
  @ApiConflictResponse({ description: "Nome já cadastrado" })
  atualizar(
    @Param("identificador") identificador: string,
    @Body() dadosEntrada: DadosAtualizarServico,
  ) {
    return this.atualizarServico.executar(identificador, dadosEntrada);
  }

  @Delete(":identificador")
  @HttpCode(204)
  @ApiNoContentResponse({ description: "Serviço excluído" })
  @ApiNotFoundResponse({ description: "Serviço não encontrado" })
  @ApiConflictResponse({
    description: "Serviço vinculado a uma ordem de serviço",
  })
  async excluir(@Param("identificador") identificador: string): Promise<void> {
    await this.excluirServico.executar(identificador);
  }
}
