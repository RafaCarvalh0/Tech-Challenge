import {
  ErroConflito,
  ErroNaoEncontrado,
  ErroValidacao,
} from "../../../compartilhado/dominio/erros";
import { RepositorioServico } from "./servico.repositorio";
import { SaidaServico, paraSaidaServico } from "./servico.saida";

export interface EntradaAtualizarServico {
  nome?: string;
  descricao?: string | null;
  precoEmCentavos?: number;
}

export class CasoUsoAtualizarServico {
  constructor(private readonly servicos: RepositorioServico) {}

  async executar(
    identificador: string,
    dadosEntrada: EntradaAtualizarServico,
  ): Promise<SaidaServico> {
    if (
      dadosEntrada.nome === undefined &&
      dadosEntrada.descricao === undefined &&
      dadosEntrada.precoEmCentavos === undefined
    ) {
      throw new ErroValidacao("Informe ao menos um campo para atualização");
    }

    const servico = await this.servicos.buscarPorId(identificador);
    if (!servico) {
      throw new ErroNaoEncontrado("Serviço não encontrado");
    }

    const servicoAtualizado = servico.atualizar(dadosEntrada);
    const servicoMesmoNome = await this.servicos.buscarPorNome(
      servicoAtualizado.nome,
    );
    if (
      servicoMesmoNome &&
      servicoMesmoNome.identificador !== servico.identificador
    ) {
      throw new ErroConflito("Serviço já cadastrado com este nome");
    }

    await this.servicos.atualizar(servicoAtualizado);
    return paraSaidaServico(servicoAtualizado);
  }
}
