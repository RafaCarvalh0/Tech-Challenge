import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { CHAVE_ROTA_PUBLICA } from "../apresentacao/rota-publica.decorador";

export interface UsuarioAutenticado {
  sub: string;
  perfil: "ADMINISTRADOR";
}

type RequisicaoAutenticada = Request & { usuario?: UsuarioAutenticado };

@Injectable()
export class GuardaAutenticacaoJwt implements CanActivate {
  constructor(
    private readonly refletor: Reflector,
    private readonly servicoJwt: JwtService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const rotaPublica = this.refletor.getAllAndOverride<boolean>(
      CHAVE_ROTA_PUBLICA,
      [contexto.getHandler(), contexto.getClass()],
    );
    if (rotaPublica) {
      return true;
    }

    const requisicao = contexto
      .switchToHttp()
      .getRequest<RequisicaoAutenticada>();
    const token = this.extrairToken(requisicao);
    if (!token) {
      throw new UnauthorizedException("Token de autenticação não informado");
    }

    try {
      const usuario =
        await this.servicoJwt.verifyAsync<UsuarioAutenticado>(token);
      if (usuario.perfil !== "ADMINISTRADOR") {
        throw new UnauthorizedException("Perfil não autorizado");
      }
      requisicao.usuario = usuario;
      return true;
    } catch (error_) {
      if (error_ instanceof UnauthorizedException) {
        throw error_;
      }
      throw new UnauthorizedException("Token de autenticação inválido");
    }
  }

  private extrairToken(requisicao: Request): string | undefined {
    const [tipo, token] = requisicao.headers.authorization?.split(" ") ?? [];
    return tipo === "Bearer" ? token : undefined;
  }
}
