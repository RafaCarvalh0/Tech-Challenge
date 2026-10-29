import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from "../../../compartilhado/dominio/erros";
import { Servico } from "../dominio/servico";
import { CasoUsoAtualizarServico } from "./atualizar-servico.caso-uso";
import { CasoUsoCriarServico } from "./criar-servico.caso-uso";
import { CasoUsoExcluirServico } from "./excluir-servico.caso-uso";
import { CasoUsoListarServicos } from "./listar-servicos.caso-uso";
import { RepositorioServico } from "./servico.repositorio";

class RepositorioServicoEmMemoria implements RepositorioServico {
  constructor(readonly servicos: Servico[] = []) {}

  async buscarPorId(identificador: string): Promise<Servico | null> {
    return (
      this.servicos.find(
        (servico) => servico.identificador === identificador,
      ) ?? null
    );
  }

  async buscarPorNome(nome: string): Promise<Servico | null> {
    return this.servicos.find((servico) => servico.nome === nome) ?? null;
  }

  async listar(): Promise<Servico[]> {
    return [...this.servicos].sort((primeiro, segundo) =>
      primeiro.nome.localeCompare(segundo.nome),
    );
  }

  async salvar(servico: Servico): Promise<void> {
    this.servicos.push(servico);
  }

  async atualizar(servico: Servico): Promise<void> {
    const indice = this.servicos.findIndex(
      (registro) => registro.identificador === servico.identificador,
    );
    this.servicos[indice] = servico;
  }

  async excluir(identificador: string): Promise<void> {
    const indice = this.servicos.findIndex(
      (servico) => servico.identificador === identificador,
    );
    this.servicos.splice(indice, 1);
  }
}

describe("Gerenciamento de serviços", () => {
  it("cria e lista serviços em ordem alfabética", async () => {
    const repositorio = new RepositorioServicoEmMemoria();
    const criar = new CasoUsoCriarServico(repositorio);

    await criar.executar({ nome: "Troca de óleo", precoEmCentavos: 15000 });
    await criar.executar({ nome: "Alinhamento", precoEmCentavos: 9000 });

    await expect(
      new CasoUsoListarServicos(repositorio).executar(),
    ).resolves.toEqual([
      expect.objectContaining({ nome: "Alinhamento" }),
      expect.objectContaining({ nome: "Troca de óleo" }),
    ]);
  });

  it("rejeita serviço com nome duplicado", async () => {
    const repositorio = new RepositorioServicoEmMemoria();
    const criar = new CasoUsoCriarServico(repositorio);
    await criar.executar({ nome: "Alinhamento", precoEmCentavos: 9000 });

    await expect(
      criar.executar({ nome: "Alinhamento", precoEmCentavos: 10000 }),
    ).rejects.toThrow(ErroConflito);
  });

  it("atualiza o serviço e rejeita atualização vazia", async () => {
    const repositorio = new RepositorioServicoEmMemoria();
    const criado = await new CasoUsoCriarServico(repositorio).executar({
      nome: "Alinhamento",
      precoEmCentavos: 9000,
    });
    const atualizar = new CasoUsoAtualizarServico(repositorio);

    await expect(
      atualizar.executar(criado.identificador, { precoEmCentavos: 10000 }),
    ).resolves.toMatchObject({ precoEmCentavos: 10000 });
    await expect(atualizar.executar(criado.identificador, {})).rejects.toThrow(
      ErroValidacao,
    );
  });

  it("atualiza nome e descrição preservando o preço", async () => {
    const repositorio = new RepositorioServicoEmMemoria();
    const criado = await new CasoUsoCriarServico(repositorio).executar({
      nome: "Alinhamento",
      precoEmCentavos: 9000,
    });

    await expect(
      new CasoUsoAtualizarServico(repositorio).executar(criado.identificador, {
        nome: "Alinhamento computadorizado",
        descricao: "Eixos dianteiro e traseiro",
      }),
    ).resolves.toMatchObject({
      nome: "Alinhamento computadorizado",
      descricao: "Eixos dianteiro e traseiro",
      precoEmCentavos: 9000,
    });
  });

  it("rejeita atualização de serviço inexistente", async () => {
    await expect(
      new CasoUsoAtualizarServico(new RepositorioServicoEmMemoria()).executar(
        "ausente",
        { nome: "Alinhamento" },
      ),
    ).rejects.toThrow(ErroNaoEncontrado);
  });

  it("rejeita atualização para nome utilizado por outro serviço", async () => {
    const repositorio = new RepositorioServicoEmMemoria();
    const criar = new CasoUsoCriarServico(repositorio);
    const alinhamento = await criar.executar({
      nome: "Alinhamento",
      precoEmCentavos: 9000,
    });
    await criar.executar({
      nome: "Balanceamento",
      precoEmCentavos: 7000,
    });

    await expect(
      new CasoUsoAtualizarServico(repositorio).executar(
        alinhamento.identificador,
        { nome: "Balanceamento" },
      ),
    ).rejects.toThrow(ErroConflito);
  });

  it("exclui serviço existente e rejeita identificador inexistente", async () => {
    const repositorio = new RepositorioServicoEmMemoria();
    const criado = await new CasoUsoCriarServico(repositorio).executar({
      nome: "Alinhamento",
      precoEmCentavos: 9000,
    });
    const excluir = new CasoUsoExcluirServico(repositorio);

    await excluir.executar(criado.identificador);
    expect(repositorio.servicos).toHaveLength(0);
    await expect(excluir.executar("ausente")).rejects.toThrow(
      ErroNaoEncontrado,
    );
  });
});
