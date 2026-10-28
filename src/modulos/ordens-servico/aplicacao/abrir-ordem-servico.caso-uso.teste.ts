import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from "../../../compartilhado/dominio/erros";
import { RepositorioCliente } from "../../clientes/aplicacao/cliente.repositorio";
import { Cliente } from "../../clientes/dominio/cliente";
import { Veiculo } from "../../veiculos/dominio/veiculo";
import { OrdemServico } from "../dominio/ordem-servico";
import {
  DadosPersistirAberturaOrdemServico,
  RepositorioAberturaOrdemServico,
} from "./abertura-ordem-servico.repositorio";
import { CasoUsoAbrirOrdemServico } from "./abrir-ordem-servico.caso-uso";

class RepositorioClienteEmMemoria implements RepositorioCliente {
  constructor(private readonly cliente: Cliente | null) {}
  async buscarPorId(): Promise<Cliente | null> {
    return this.cliente;
  }
  async buscarPorCpfCnpj(cpfCnpj: string): Promise<Cliente | null> {
    return this.cliente?.cpfCnpj.valor === cpfCnpj ? this.cliente : null;
  }
  async listar(): Promise<Cliente[]> {
    return this.cliente ? [this.cliente] : [];
  }
  async salvar(): Promise<void> {}
  async atualizar(): Promise<void> {}
  async excluir(): Promise<void> {}
}

class RepositorioAberturaEmMemoria
  implements RepositorioAberturaOrdemServico
{
  readonly ordensServico: OrdemServico[] = [];

  constructor(
    readonly veiculos: Veiculo[] = [],
    private readonly falharAoSalvar = false,
  ) {}

  async abrir(
    dadosEntrada: DadosPersistirAberturaOrdemServico,
  ): Promise<OrdemServico> {
    let veiculo = this.veiculos.find(
      (item) => item.placa.valor === dadosEntrada.veiculo.placa,
    );
    if (veiculo && veiculo.clienteId !== dadosEntrada.clienteId) {
      throw new ErroConflito("Veículo pertence a outro cliente");
    }
    if (!veiculo) {
      const { marca, modelo, ano } = dadosEntrada.veiculo;
      if (marca === undefined || modelo === undefined || ano === undefined) {
        throw new ErroValidacao(
          "Marca, modelo e ano são obrigatórios para cadastrar um veículo novo",
        );
      }
      veiculo = Veiculo.criar({
        clienteId: dadosEntrada.clienteId,
        placa: dadosEntrada.veiculo.placa,
        marca,
        modelo,
        ano,
      });
    }
    const ordemServico = OrdemServico.criar({
      clienteId: dadosEntrada.clienteId,
      veiculoId: veiculo.identificador,
      descricao: dadosEntrada.descricao,
    });
    if (this.falharAoSalvar) {
      throw new Error("Falha simulada no banco");
    }
    if (!this.veiculos.includes(veiculo)) {
      this.veiculos.push(veiculo);
    }
    this.ordensServico.push(ordemServico);
    return ordemServico;
  }
}

function criarCliente(): Cliente {
  return Cliente.restaurar({
    identificador: "cliente-1",
    nome: "Maria da Silva",
    cpfCnpj: "52998224725",
    criadoEm: new Date("2026-10-27T12:00:00.000Z"),
  });
}

function criarVeiculo(clienteId = "cliente-1"): Veiculo {
  return Veiculo.restaurar({
    identificador: "veiculo-1",
    clienteId,
    placa: "ABC1D23",
    marca: "Honda",
    modelo: "Civic",
    ano: 2022,
    criadoEm: new Date("2026-10-27T12:00:00.000Z"),
  });
}

describe("Abertura da ordem de serviço", () => {
  const entradaBase = {
    cpfCnpj: "529.982.247-25",
    descricao: "Troca de óleo",
    veiculo: { placa: "abc1d23" },
  };

  it("abre a OS usando CPF/CNPJ e veículo já cadastrado", async () => {
    const aberturas = new RepositorioAberturaEmMemoria([criarVeiculo()]);
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioClienteEmMemoria(criarCliente()),
      aberturas,
    );
    const resultado = await casoUso.executar(entradaBase);
    expect(resultado).toMatchObject({
      clienteId: "cliente-1",
      veiculoId: "veiculo-1",
      status: "RECEBIDA",
      codigoAcompanhamento: expect.any(String),
    });
    expect(aberturas.ordensServico).toHaveLength(1);
  });

  it("cadastra o veículo novo durante a abertura", async () => {
    const aberturas = new RepositorioAberturaEmMemoria();
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioClienteEmMemoria(criarCliente()),
      aberturas,
    );
    const resultado = await casoUso.executar({
      ...entradaBase,
      veiculo: {
        placa: "BRA2E19",
        marca: "Toyota",
        modelo: "Corolla",
        ano: 2024,
      },
    });
    expect(aberturas.veiculos).toHaveLength(1);
    expect(resultado.veiculoId).toBe(aberturas.veiculos[0].identificador);
  });

  it("rejeita cliente não cadastrado", async () => {
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioClienteEmMemoria(null),
      new RepositorioAberturaEmMemoria(),
    );
    await expect(casoUso.executar(entradaBase)).rejects.toThrow(
      ErroNaoEncontrado,
    );
  });

  it("rejeita veículo pertencente a outro cliente", async () => {
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioClienteEmMemoria(criarCliente()),
      new RepositorioAberturaEmMemoria([criarVeiculo("outro-cliente")]),
    );
    await expect(casoUso.executar(entradaBase)).rejects.toThrow(ErroConflito);
  });

  it("exige dados completos para cadastrar veículo novo", async () => {
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioClienteEmMemoria(criarCliente()),
      new RepositorioAberturaEmMemoria(),
    );
    await expect(casoUso.executar(entradaBase)).rejects.toThrow(ErroValidacao);
  });

  it("não persiste veículo quando a criação da OS falha", async () => {
    const aberturas = new RepositorioAberturaEmMemoria([], true);
    const casoUso = new CasoUsoAbrirOrdemServico(
      new RepositorioClienteEmMemoria(criarCliente()),
      aberturas,
    );
    await expect(
      casoUso.executar({
        ...entradaBase,
        veiculo: {
          placa: "BRA2E19",
          marca: "Toyota",
          modelo: "Corolla",
          ano: 2024,
        },
      }),
    ).rejects.toThrow("Falha simulada no banco");
    expect(aberturas.veiculos).toHaveLength(0);
  });
});
