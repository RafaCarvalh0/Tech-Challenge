import { ErroValidacao } from "../../../compartilhado/dominio/erros";
import { Servico } from "./servico";

describe("Serviço", () => {
  it("normaliza os dados ao criar", () => {
    const servico = Servico.criar({
      nome: "  Troca de óleo  ",
      descricao: "  Óleo e filtro  ",
      precoEmCentavos: 15000,
    });

    expect(servico).toMatchObject({
      nome: "Troca de óleo",
      descricao: "Óleo e filtro",
      precoEmCentavos: 15000,
    });
  });

  it.each([-1, 10.5])("rejeita preço inválido: %s", (precoEmCentavos) => {
    expect(() =>
      Servico.criar({ nome: "Alinhamento", precoEmCentavos }),
    ).toThrow(ErroValidacao);
  });

  it("atualiza nome e descrição preservando o preço", () => {
    const servico = Servico.criar({
      nome: "Alinhamento",
      precoEmCentavos: 9000,
    });

    const atualizado = servico.atualizar({
      nome: "Alinhamento computadorizado",
      descricao: "Eixos dianteiro e traseiro",
    });

    expect(atualizado).toMatchObject({
      nome: "Alinhamento computadorizado",
      descricao: "Eixos dianteiro e traseiro",
      precoEmCentavos: 9000,
    });
  });

  it("rejeita nome vazio", () => {
    expect(() => Servico.criar({ nome: "  ", precoEmCentavos: 9000 })).toThrow(
      ErroValidacao,
    );
  });
});
