import { ErroNaoEncontrado } from "../../../compartilhado/dominio/erros";
import { StatusOrdemServico } from "../../ordens-servico/dominio/status-ordem-servico";
import { CasoUsoConsultarAcompanhamento } from "./consultar-acompanhamento.caso-uso";
import {
  AcompanhamentoOrdemServico,
  RepositorioAcompanhamento,
} from "./acompanhamento.repositorio";

class RepositorioAcompanhamentoFalso implements RepositorioAcompanhamento {
  async buscar(
    identificador: string,
    codigoAcompanhamento: string,
  ): Promise<AcompanhamentoOrdemServico | null> {
    if (
      identificador !== "ordem-1" ||
      codigoAcompanhamento !== "codigo-valido"
    ) {
      return null;
    }
    return {
      identificador,
      descricao: "Troca de óleo",
      status: StatusOrdemServico.EM_DIAGNOSTICO,
      atualizadoEm: new Date("2026-10-28T12:00:00.000Z"),
      composicao: null,
      orcamento: null,
    };
  }
}

describe("CasoUsoConsultarAcompanhamento", () => {
  const casoUso = new CasoUsoConsultarAcompanhamento(
    new RepositorioAcompanhamentoFalso(),
  );

  it("retorna somente os dados necessários ao acompanhamento", async () => {
    await expect(
      casoUso.executar("ordem-1", "codigo-valido"),
    ).resolves.toEqual({
      identificador: "ordem-1",
      descricao: "Troca de óleo",
      status: StatusOrdemServico.EM_DIAGNOSTICO,
      atualizadoEm: new Date("2026-10-28T12:00:00.000Z"),
      composicao: null,
      orcamento: null,
    });
  });

  it("não revela se a ordem existe quando o código está ausente ou inválido", async () => {
    await expect(casoUso.executar("ordem-1", "")).rejects.toBeInstanceOf(
      ErroNaoEncontrado,
    );
    await expect(
      casoUso.executar("ordem-1", "codigo-invalido"),
    ).rejects.toBeInstanceOf(ErroNaoEncontrado);
  });
});
