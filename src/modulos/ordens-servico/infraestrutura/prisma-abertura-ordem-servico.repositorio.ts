import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { ServicoPrisma } from "../../../banco-dados/prisma.servico";
import {
  ErroConflito,
  ErroValidacao,
} from "../../../compartilhado/dominio/erros";
import { Veiculo } from "../../veiculos/dominio/veiculo";
import {
  DadosPersistirAberturaOrdemServico,
  RepositorioAberturaOrdemServico,
} from "../aplicacao/abertura-ordem-servico.repositorio";
import { OrdemServico } from "../dominio/ordem-servico";

export class RepositorioPrismaAberturaOrdemServico
  implements RepositorioAberturaOrdemServico
{
  constructor(private readonly servicoPrisma: ServicoPrisma) {}

  async abrir(
    dadosEntrada: DadosPersistirAberturaOrdemServico,
  ): Promise<OrdemServico> {
    try {
      return await this.servicoPrisma.$transaction(
        async (transacao) => {
          const veiculo = await this.obterOuCriarVeiculo(
            transacao,
            dadosEntrada,
          );
          const ordemServico = OrdemServico.criar({
            clienteId: dadosEntrada.clienteId,
            veiculoId: veiculo.identificador,
            descricao: dadosEntrada.descricao,
          });
          await transacao.ordemServico.create({
            data: {
              identificador: ordemServico.identificador,
              clienteId: ordemServico.clienteId,
              veiculoId: ordemServico.veiculoId,
              codigoAcompanhamento: ordemServico.codigoAcompanhamento,
              descricao: ordemServico.descricao,
              status: ordemServico.status,
              criadoEm: ordemServico.criadoEm,
              atualizadoEm: ordemServico.atualizadoEm,
            },
          });
          return ordemServico;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error_) {
      if (
        error_ instanceof PrismaClientKnownRequestError &&
        error_.code === "P2002"
      ) {
        throw new ErroConflito("Veículo já cadastrado para esta placa");
      }
      throw error_;
    }
  }

  private async obterOuCriarVeiculo(
    transacao: Prisma.TransactionClient,
    dadosEntrada: DadosPersistirAberturaOrdemServico,
  ): Promise<Veiculo> {
    const registro = await transacao.veiculo.findUnique({
      where: { placa: dadosEntrada.veiculo.placa },
    });
    if (registro) {
      if (registro.clienteId !== dadosEntrada.clienteId) {
        throw new ErroConflito("Veículo pertence a outro cliente");
      }
      return Veiculo.restaurar(registro);
    }

    const { marca, modelo, ano } = dadosEntrada.veiculo;
    if (marca === undefined || modelo === undefined || ano === undefined) {
      throw new ErroValidacao(
        "Marca, modelo e ano são obrigatórios para cadastrar um veículo novo",
      );
    }
    const veiculo = Veiculo.criar({
      clienteId: dadosEntrada.clienteId,
      placa: dadosEntrada.veiculo.placa,
      marca,
      modelo,
      ano,
    });
    await transacao.veiculo.create({
      data: {
        identificador: veiculo.identificador,
        clienteId: veiculo.clienteId,
        placa: veiculo.placa.valor,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        criadoEm: veiculo.criadoEm,
      },
    });
    return veiculo;
  }
}
