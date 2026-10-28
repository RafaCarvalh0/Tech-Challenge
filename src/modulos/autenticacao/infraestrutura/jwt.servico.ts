import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { PerfilUsuario, ServicoToken } from "../aplicacao/token.servico";

@Injectable()
export class ServicoJwt implements ServicoToken {
  constructor(private readonly servicoJwt: JwtService) {}

  gerar(usuario: string, perfil: PerfilUsuario): Promise<string> {
    return this.servicoJwt.signAsync({ sub: usuario, perfil });
  }
}
