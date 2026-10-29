import { ErroNaoEncontrado } from "../../../compartilhado/dominio/erros";
import { CasoUsoDecidirOrcamento } from "../../ordens-servico/aplicacao/decidir-orcamento.caso-uso";
import { RepositorioOrcamento } from "../../ordens-servico/aplicacao/orcamento.repositorio";
import { DecisaoOrcamento } from "../../ordens-servico/dominio/decisao-orcamento";
import { Orcamento } from "../../ordens-servico/dominio/orcamento";
import { OrdemServico } from "../../ordens-servico/dominio/ordem-servico";
import { SituacaoOrcamento } from "../../ordens-servico/dominio/situacao-orcamento";
import { StatusOrdemServico } from "../../ordens-servico/dominio/status-ordem-servico";
import {
  AcompanhamentoOrdemServico,
  RepositorioAcompanhamento,
} from "./acompanhamento.repositorio";
import { CasoUsoConsultarAcompanhamento } from "./consultar-acompanhamento.caso-uso";
import { CasoUsoDecidirOrcamentoAcompanhamento } from "./decidir-orcamento-acompanhamento.caso-uso";

const instante = new Date("2026-10-28T12:00:00.000Z");

class RepositorioAcompanhamentoFalso implements RepositorioAcompanhamento {
  async buscar(
    identificador: string,
    codigoAcompanhamento: string,
  ): Promise<AcompanhamentoOrdemServico | null> {
    if (identificador !== "ordem-1" || codigoAcompanhamento !== "codigo-valido") {
      return null;
    }
    return {
      identificador,
      descricao: "Revisão preventiva",
      status: StatusOrdemServico.AGUARDANDO_APROVACAO,
      atualizadoEm: instante,
      composicao: null,
      orcamento: {
        totalEmCentavos: 15500,
        situacao: SituacaoOrcamento.PENDENTE,
        geradoEm: instante,
        decididoEm: null,
      },
    };
  }
}

class RepositorioOrcamentoFalso implements RepositorioOrcamento {
  decisoes = 0;

  async buscarPorOrdemServicoId(): Promise<Orcamento | null> {
    return null;
  }

  async enviar(): Promise<Orcamento> {
    throw new Error("não usado neste teste");
  }

  async decidir(
    ordemServicoId: string,
  ): Promise<{ orcamento: Orcamento; ordemServico: OrdemServico }> {
    this.decisoes += 1;
    return {
      orcamento: Orcamento.restaurar({
        identificador: "orcamento-1",
        ordemServicoId,
        subtotalServicosEmCentavos: 15500,
        subtotalPecasInsumosEmCentavos: 0,
        totalEmCentavos: 15500,
        situacao: SituacaoOrcamento.APROVADO,
        geradoEm: instante,
        atualizadoEm: instante,
        decididoEm: instante,
      }),
      ordemServico: OrdemServico.restaurar({
        identificador: ordemServicoId,
        clienteId: "cliente-1",
        veiculoId: "veiculo-1",
        descricao: "Revisão preventiva",
        codigoAcompanhamento: "codigo-valido",
        status: StatusOrdemServico.EM_EXECUCAO,
        inicioExecucaoEm: instante,
        criadoEm: instante,
        atualizadoEm: instante,
      }),
    };
  }
}

function criarCasoUso() {
  const orcamentos = new RepositorioOrcamentoFalso();
  const casoUso = new CasoUsoDecidirOrcamentoAcompanhamento(
    new CasoUsoConsultarAcompanhamento(new RepositorioAcompanhamentoFalso()),
    new CasoUsoDecidirOrcamento(orcamentos),
  );
  return { casoUso, orcamentos };
}

describe("CasoUsoDecidirOrcamentoAcompanhamento", () => {
  it("decide o orçamento somente depois de validar o código privado", async () => {
    const { casoUso, orcamentos } = criarCasoUso();

    await expect(
      casoUso.executar("ordem-1", "codigo-valido", DecisaoOrcamento.APROVAR),
    ).resolves.toMatchObject({
      ordemServico: { status: StatusOrdemServico.EM_EXECUCAO },
      orcamento: { situacao: SituacaoOrcamento.APROVADO },
    });
    expect(orcamentos.decisoes).toBe(1);
  });

  it("não executa a decisão quando o código é inválido", async () => {
    const { casoUso, orcamentos } = criarCasoUso();

    await expect(
      casoUso.executar("ordem-1", "codigo-invalido", DecisaoOrcamento.APROVAR),
    ).rejects.toBeInstanceOf(ErroNaoEncontrado);
    expect(orcamentos.decisoes).toBe(0);
  });
});
