import { ErroValidacao } from '../../../compartilhado/dominio/erros';

export class CpfCnpj {
  private constructor(readonly valor: string) {}

  static criar(entrada: string): CpfCnpj {
    const valor = entrada.replace(/\D/g, '');
    const ehValido =
      (valor.length === 11 && CpfCnpj.hasValidDigits(valor, 9)) ||
      (valor.length === 14 && CpfCnpj.hasValidDigits(valor, 12));

    if (!ehValido || /^(\d)\1+$/.test(valor)) {
      throw new ErroValidacao('CPF/CNPJ inválido');
    }

    return new CpfCnpj(valor);
  }

  private static hasValidDigits(valor: string, tamanhoBase: number): boolean {
    const primeiroDigito = CpfCnpj.calculateDigit(valor.slice(0, tamanhoBase));
    const segundoDigito = CpfCnpj.calculateDigit(
      `${valor.slice(0, tamanhoBase)}${primeiroDigito}`,
    );

    return valor.endsWith(`${primeiroDigito}${segundoDigito}`);
  }

  private static calculateDigit(base: string): number {
    const pesoInicial = base.length <= 10 ? base.length + 1 : base.length - 7;
    let peso = pesoInicial;
    const soma = [...base].reduce((total, digito) => {
      const resultado = total + Number(digito) * peso;
      peso = peso === 2 ? 9 : peso - 1;
      return resultado;
    }, 0);
    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  }
}
