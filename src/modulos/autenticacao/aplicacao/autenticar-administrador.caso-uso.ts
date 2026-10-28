import { timingSafeEqual } from "node:crypto";

import { UnauthorizedException } from "@nestjs/common";

import { ServicoToken } from "./token.servico";

export interface EntradaAutenticarAdministrador {
  usuario: string;
  senha: string;
}

export interface SaidaAutenticacao {
  accessToken: string;
  tipoToken: "Bearer";
}

export class CasoUsoAutenticarAdministrador {
  constructor(
    private readonly usuarioConfigurado: string,
    private readonly senhaConfigurada: string,
    private readonly servicoToken: ServicoToken,
  ) {}

  async executar(
    dadosEntrada: EntradaAutenticarAdministrador,
  ): Promise<SaidaAutenticacao> {
    if (
      !this.saoIguais(dadosEntrada.usuario, this.usuarioConfigurado) ||
      !this.saoIguais(dadosEntrada.senha, this.senhaConfigurada)
    ) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    return {
      accessToken: await this.servicoToken.gerar(
        dadosEntrada.usuario,
        "ADMINISTRADOR",
      ),
      tipoToken: "Bearer",
    };
  }

  private saoIguais(valor: string, valorEsperado: string): boolean {
    const recebido = Buffer.from(valor);
    const esperado = Buffer.from(valorEsperado);
    return (
      recebido.length === esperado.length && timingSafeEqual(recebido, esperado)
    );
  }
}
