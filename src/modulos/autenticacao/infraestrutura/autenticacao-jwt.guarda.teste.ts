import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

import { GuardaAutenticacaoJwt } from "./autenticacao-jwt.guarda";

function criarContexto(autorizacao?: string): {
  contexto: ExecutionContext;
  requisicao: { headers: { authorization?: string }; usuario?: unknown };
} {
  const requisicao = { headers: { authorization: autorizacao } };
  return {
    requisicao,
    contexto: {
      getHandler: () => "manipulador",
      getClass: () => "controlador",
      switchToHttp: () => ({ getRequest: () => requisicao }),
    } as unknown as ExecutionContext,
  };
}

describe("GuardaAutenticacaoJwt", () => {
  it("permite rota marcada como pública sem token", async () => {
    const refletor = {
      getAllAndOverride: () => true,
    } as unknown as Reflector;
    const jwt = { verifyAsync: jest.fn() } as unknown as JwtService;
    const guarda = new GuardaAutenticacaoJwt(refletor, jwt);

    await expect(guarda.canActivate(criarContexto().contexto)).resolves.toBe(
      true,
    );
  });

  it("rejeita rota administrativa sem token", async () => {
    const refletor = {
      getAllAndOverride: () => false,
    } as unknown as Reflector;
    const jwt = { verifyAsync: jest.fn() } as unknown as JwtService;
    const guarda = new GuardaAutenticacaoJwt(refletor, jwt);

    await expect(
      guarda.canActivate(criarContexto().contexto),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("valida bearer token e disponibiliza o usuário na requisição", async () => {
    const refletor = {
      getAllAndOverride: () => false,
    } as unknown as Reflector;
    const usuario = { sub: "administrador", perfil: "ADMINISTRADOR" };
    const jwt = {
      verifyAsync: jest.fn().mockResolvedValue(usuario),
    } as unknown as JwtService;
    const guarda = new GuardaAutenticacaoJwt(refletor, jwt);
    const { contexto, requisicao } = criarContexto("Bearer token-valido");

    await expect(guarda.canActivate(contexto)).resolves.toBe(true);
    expect(requisicao.usuario).toEqual(usuario);
  });

  it("rejeita token expirado", async () => {
    const refletor = {
      getAllAndOverride: () => false,
    } as unknown as Reflector;
    const jwt = {
      verifyAsync: jest.fn().mockRejectedValue(new Error("jwt expired")),
    } as unknown as JwtService;
    const guarda = new GuardaAutenticacaoJwt(refletor, jwt);

    await expect(
      guarda.canActivate(criarContexto("Bearer token-expirado").contexto),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
