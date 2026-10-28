import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { CasoUsoAutenticarAdministrador } from "./aplicacao/autenticar-administrador.caso-uso";
import { ControladorAutenticacao } from "./apresentacao/autenticacao.controller";
import { GuardaAutenticacaoJwt } from "./infraestrutura/autenticacao-jwt.guarda";
import { ServicoJwt } from "./infraestrutura/jwt.servico";

function obterConfiguracaoObrigatoria(
  configuracao: ConfigService,
  nome: string,
): string {
  const valor = configuracao.get<string>(nome);
  if (!valor) {
    throw new Error(`A variável ${nome} é obrigatória`);
  }
  return valor;
}

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configuracao: ConfigService) => ({
        secret: obterConfiguracaoObrigatoria(configuracao, "SEGREDO_JWT"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  controllers: [ControladorAutenticacao],
  providers: [
    ServicoJwt,
    {
      provide: CasoUsoAutenticarAdministrador,
      useFactory: (configuracao: ConfigService, servicoJwt: ServicoJwt) =>
        new CasoUsoAutenticarAdministrador(
          obterConfiguracaoObrigatoria(configuracao, "USUARIO_ADMINISTRADOR"),
          obterConfiguracaoObrigatoria(configuracao, "SENHA_ADMINISTRADOR"),
          servicoJwt,
        ),
      inject: [ConfigService, ServicoJwt],
    },
    { provide: APP_GUARD, useClass: GuardaAutenticacaoJwt },
  ],
})
export class ModuloAutenticacao {}
