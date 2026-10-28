import { ErroNaoEncontrado } from "../../../compartilhado/dominio/erros";
import {
  AcompanhamentoOrdemServico,
  RepositorioAcompanhamento,
} from "./acompanhamento.repositorio";

export class CasoUsoConsultarAcompanhamento {
  constructor(
    private readonly acompanhamentos: RepositorioAcompanhamento,
  ) {}

  async executar(
    identificador: string,
    codigoAcompanhamento: string | undefined,
  ): Promise<AcompanhamentoOrdemServico> {
    const acompanhamento = codigoAcompanhamento
      ? await this.acompanhamentos.buscar(
          identificador,
          codigoAcompanhamento.trim(),
        )
      : null;
    if (!acompanhamento) {
      throw new ErroNaoEncontrado("Ordem de serviço não encontrada");
    }
    return acompanhamento;
  }
}
