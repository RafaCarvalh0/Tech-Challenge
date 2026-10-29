import { ErroNaoEncontrado } from "../../../compartilhado/dominio/erros";
import { Servico } from "../dominio/servico";
import { CasoUsoObterServico } from "./obter-servico.caso-uso";
import { RepositorioServico } from "./servico.repositorio";

class ConsultaServico implements RepositorioServico {
  constructor(private readonly servico: Servico | null) {}

  async buscarPorId(): Promise<Servico | null> {
    return this.servico;
  }

  async buscarPorNome(): Promise<Servico | null> {
    return this.servico;
  }

  async listar(): Promise<Servico[]> {
    return this.servico ? [this.servico] : [];
  }

  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

describe("CasoUsoObterServico", () => {
  it("retorna o serviço existente", async () => {
    const servico = Servico.restaurar({
      identificador: "servico-1",
      nome: "Alinhamento",
      descricao: "Eixos dianteiro e traseiro",
      precoEmCentavos: 9000,
      criadoEm: new Date("2026-10-27T12:00:00.000Z"),
      atualizadoEm: new Date("2026-10-27T12:00:00.000Z"),
    });

    await expect(
      new CasoUsoObterServico(new ConsultaServico(servico)).executar(
        "servico-1",
      ),
    ).resolves.toMatchObject({
      identificador: "servico-1",
      nome: "Alinhamento",
      precoEmCentavos: 9000,
    });
  });

  it("rejeita serviço inexistente", async () => {
    await expect(
      new CasoUsoObterServico(new ConsultaServico(null)).executar("ausente"),
    ).rejects.toThrow(ErroNaoEncontrado);
  });
});
