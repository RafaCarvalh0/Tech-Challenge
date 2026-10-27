import { ErroValidacao } from '../../../compartilhado/dominio/erros';

export class Placa {
  private constructor(readonly valor: string) {}

  static criar(entrada: string): Placa {
    const valor = entrada.replace(/[-\s]/g, '').toUpperCase();
    const ehFormatoAntigo = /^[A-Z]{3}\d{4}$/.test(valor);
    const ehFormatoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/.test(valor);

    if (!ehFormatoAntigo && !ehFormatoMercosul) {
      throw new ErroValidacao('Placa de veículo inválida');
    }

    return new Placa(valor);
  }
}
