import { ErroNaoEncontrado } from "../../../compartilhado/dominio/erros";
import { RepositorioServico } from "./servico.repositorio";

export class CasoUsoExcluirServico {
  constructor(private readonly servicos: RepositorioServico) {}

  async executar(identificador: string): Promise<void> {
    const servico = await this.servicos.buscarPorId(identificador);
    if (!servico) {
      throw new ErroNaoEncontrado("Serviço não encontrado");
    }
    await this.servicos.excluir(identificador);
  }
}
