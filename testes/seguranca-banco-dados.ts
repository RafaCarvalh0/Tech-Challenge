export function validarUrlBancoDadosTeste(urlBancoDados: string | undefined): void {
  if (!urlBancoDados) {
    throw new Error('URL_BANCO_DADOS é obrigatória para testes ponta a ponta');
  }

  const nomeBancoDados = new URL(urlBancoDados).pathname.replace(/^\//, '');
  if (!nomeBancoDados.endsWith('_teste')) {
    throw new Error(
      'Testes ponta a ponta exigem um banco dedicado terminado em _teste',
    );
  }
}
