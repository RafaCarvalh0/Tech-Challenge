import { RepositorioServico } from "./servico.repositorio";
import { SaidaServico, paraSaidaServico } from "./servico.saida";

export class CasoUsoListarServicos {
  constructor(private readonly servicos: RepositorioServico) {}

  async executar(): Promise<SaidaServico[]> {
    const servicos = await this.servicos.listar();
    return servicos.map(paraSaidaServico);
  }
}
