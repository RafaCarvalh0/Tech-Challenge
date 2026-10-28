import { ErroConflito } from "../../../compartilhado/dominio/erros";
import { Servico } from "../dominio/servico";
import { RepositorioServico } from "./servico.repositorio";
import { SaidaServico, paraSaidaServico } from "./servico.saida";

export interface EntradaCriarServico {
  nome: string;
  descricao?: string;
  precoEmCentavos: number;
}

export class CasoUsoCriarServico {
  constructor(private readonly servicos: RepositorioServico) {}

  async executar(dadosEntrada: EntradaCriarServico): Promise<SaidaServico> {
    const servico = Servico.criar(dadosEntrada);
    const servicoExistente = await this.servicos.buscarPorNome(servico.nome);
    if (servicoExistente) {
      throw new ErroConflito("Serviço já cadastrado com este nome");
    }

    await this.servicos.salvar(servico);
    return paraSaidaServico(servico);
  }
}
