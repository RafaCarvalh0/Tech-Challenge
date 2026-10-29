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
  status = StatusOrdemServico.AGUARDANDO_APROVACAO;
  situacao = SituacaoOrcamento.PENDENTE;

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
      status: this.status,
      atualizadoEm: instante,
      composicao: null,
      orcamento: {
        totalEmCentavos: 15500,
        situacao: this.situacao,
        geradoEm: instante,
        decididoEm: null,
      },
    };
  }
}

class RepositorioOrcamentoFalso implements RepositorioOrcamento {
  decisoes = 0;
  ultimaDecisao: DecisaoOrcamento | null = null;

  constructor(
    private readonly acompanhamentos: RepositorioAcompanhamentoFalso,
  ) {}

  async buscarPorOrdemServicoId(): Promise<Orcamento | null> {
    return null;
  }

  async enviar(): Promise<Orcamento> {
    throw new Error("não usado neste teste");
  }

  async decidir(
    ordemServicoId: string,
    decisao: DecisaoOrcamento,
  ): Promise<{ orcamento: Orcamento; ordemServico: OrdemServico }> {
    this.decisoes += 1;
    this.ultimaDecisao = decisao;
    const aprovado = decisao === DecisaoOrcamento.APROVAR;
    this.acompanhamentos.status = aprovado
      ? StatusOrdemServico.EM_EXECUCAO
      : StatusOrdemServico.EM_DIAGNOSTICO;
    this.acompanhamentos.situacao = aprovado
      ? SituacaoOrcamento.APROVADO
      : SituacaoOrcamento.REJEITADO;
    return {
      orcamento: Orcamento.restaurar({
        identificador: "orcamento-1",
        ordemServicoId,
        subtotalServicosEmCentavos: 15500,
        subtotalPecasInsumosEmCentavos: 0,
        totalEmCentavos: 15500,
        situacao: this.acompanhamentos.situacao,
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
        status: this.acompanhamentos.status,
        inicioExecucaoEm: aprovado ? instante : null,
        criadoEm: instante,
        atualizadoEm: instante,
      }),
    };
  }
}

function criarCasoUso() {
  const acompanhamentos = new RepositorioAcompanhamentoFalso();
  const orcamentos = new RepositorioOrcamentoFalso(acompanhamentos);
  const casoUso = new CasoUsoDecidirOrcamentoAcompanhamento(
    new CasoUsoConsultarAcompanhamento(acompanhamentos),
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
      identificador: "ordem-1",
      status: StatusOrdemServico.EM_EXECUCAO,
      orcamento: { situacao: SituacaoOrcamento.APROVADO },
    });
    expect(orcamentos.decisoes).toBe(1);
    expect(orcamentos.ultimaDecisao).toBe(DecisaoOrcamento.APROVAR);
  });

  it("encaminha a rejeição e retorna o acompanhamento atualizado", async () => {
    const { casoUso, orcamentos } = criarCasoUso();

    await expect(
      casoUso.executar("ordem-1", "codigo-valido", DecisaoOrcamento.REJEITAR),
    ).resolves.toMatchObject({
      identificador: "ordem-1",
      status: StatusOrdemServico.EM_DIAGNOSTICO,
      orcamento: { situacao: SituacaoOrcamento.REJEITADO },
    });
    expect(orcamentos.ultimaDecisao).toBe(DecisaoOrcamento.REJEITAR);
  });

  it("não executa a decisão quando o código é inválido", async () => {
    const { casoUso, orcamentos } = criarCasoUso();

    await expect(
      casoUso.executar("ordem-1", "codigo-invalido", DecisaoOrcamento.APROVAR),
    ).rejects.toBeInstanceOf(ErroNaoEncontrado);
    expect(orcamentos.decisoes).toBe(0);
  });
});
