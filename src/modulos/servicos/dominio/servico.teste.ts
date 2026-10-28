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
});
