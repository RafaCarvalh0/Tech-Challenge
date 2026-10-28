import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { CasoUsoAutenticarAdministrador } from "../aplicacao/autenticar-administrador.caso-uso";
import { DadosLoginAdministrador } from "./autenticacao.dto";
import { RotaPublica } from "./rota-publica.decorador";

@ApiTags("autenticação")
@Controller("autenticacao")
export class ControladorAutenticacao {
  constructor(
    private readonly autenticarAdministrador: CasoUsoAutenticarAdministrador,
  ) {}

  @RotaPublica()
  @Post("login")
  @ApiCreatedResponse({ description: "Administrador autenticado" })
  @ApiUnauthorizedResponse({ description: "Credenciais inválidas" })
  login(@Body() dadosEntrada: DadosLoginAdministrador) {
    return this.autenticarAdministrador.executar(dadosEntrada);
  }
}
