import { ErroNaoEncontrado } from "../../../compartilhado/dominio/erros";
import { RepositorioServico } from "./servico.repositorio";
import { SaidaServico, paraSaidaServico } from "./servico.saida";

export class CasoUsoObterServico {
  constructor(private readonly servicos: RepositorioServico) {}

  async executar(identificador: string): Promise<SaidaServico> {
    const servico = await this.servicos.buscarPorId(identificador);
    if (!servico) {
      throw new ErroNaoEncontrado("Serviço não encontrado");
    }
    return paraSaidaServico(servico);
  }
}
