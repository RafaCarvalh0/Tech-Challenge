import { UnauthorizedException } from "@nestjs/common";

import { CasoUsoAutenticarAdministrador } from "./autenticar-administrador.caso-uso";
import { ServicoToken } from "./token.servico";

class ServicoTokenFalso implements ServicoToken {
  async gerar(usuario: string, perfil: "ADMINISTRADOR"): Promise<string> {
    return `token:${usuario}:${perfil}`;
  }
}

describe("CasoUsoAutenticarAdministrador", () => {
  const casoUso = new CasoUsoAutenticarAdministrador(
    "administrador",
    "senha-segura",
    new ServicoTokenFalso(),
  );

  it("gera token para credenciais administrativas válidas", async () => {
    await expect(
      casoUso.executar({ usuario: "administrador", senha: "senha-segura" }),
    ).resolves.toEqual({
      accessToken: "token:administrador:ADMINISTRADOR",
      tipoToken: "Bearer",
    });
  });

  it("rejeita credenciais administrativas inválidas", async () => {
    await expect(
      casoUso.executar({ usuario: "administrador", senha: "incorreta" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
