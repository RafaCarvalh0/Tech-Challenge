import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import requisicao = require("supertest");

import { ModuloAplicacao } from "../src/aplicacao.module";

describe("Autenticação administrativa (ponta a ponta)", () => {
  let aplicacao: INestApplication;

  beforeAll(async () => {
    process.env.SEGREDO_JWT = "segredo-de-teste-com-tamanho-suficiente";
    process.env.USUARIO_ADMINISTRADOR = "administrador";
    process.env.SENHA_ADMINISTRADOR = "senha-de-teste";

    const referenciaModulo = await Test.createTestingModule({
      imports: [ModuloAplicacao],
    }).compile();
    aplicacao = referenciaModulo.createNestApplication();
    aplicacao.setGlobalPrefix("api");
    aplicacao.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await aplicacao.init();
  });

  afterAll(async () => {
    await aplicacao.close();
  });

  it("autentica o administrador e retorna um bearer token", async () => {
    await requisicao(aplicacao.getHttpServer())
      .post("/api/autenticacao/login")
      .send({ usuario: "administrador", senha: "senha-de-teste" })
      .expect(201)
      .expect((resposta) => {
        expect(resposta.body.tipoToken).toBe("Bearer");
        expect(resposta.body.accessToken).toEqual(expect.any(String));
      });
  });

  it("rejeita credenciais inválidas e rota administrativa sem token", async () => {
    await requisicao(aplicacao.getHttpServer())
      .post("/api/autenticacao/login")
      .send({ usuario: "administrador", senha: "incorreta" })
      .expect(401);

    await requisicao(aplicacao.getHttpServer())
      .get("/api/clientes")
      .expect(401);
  });

  it("mantém a saúde pública", async () => {
    await requisicao(aplicacao.getHttpServer()).get("/api/saude").expect(200);
  });
});
