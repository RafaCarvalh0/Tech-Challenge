# Estratégia de testes

## Pirâmide aplicada

1. **Unitários de domínio:** validam entidades, objetos de valor, invariantes e transições sem infraestrutura.
2. **Unitários de aplicação:** validam casos de uso com portas e repositórios substituídos por mocks.
3. **Testes de adaptadores:** exercitam mapeamentos e comportamento de repositórios isoladamente.
4. **E2E:** sobem a aplicação NestJS e usam PostgreSQL real em banco exclusivo terminado em `_teste`.

## Escopo

- Domínio: CPF/CNPJ, placa, entidades, composição, orçamento, estoque e ciclo da OS.
- Aplicação: CRUDs, abertura, composição, decisão, acompanhamento e indicador.
- E2E: autenticação, fluxo completo, rollback transacional e proteção contra uso do banco de desenvolvimento.

## Cobertura

O Jest exige no mínimo 80% global e coleta `modulos/**/dominio`, `modulos/**/aplicacao` e `compartilhado/dominio`, excluindo testes e contratos de repositório. O resultado de 100% vale para esse escopo configurado; controllers, bootstrap e todos os adaptadores não fazem parte do denominador.

## Banco E2E

Antes de migrations e testes, `URL_BANCO_DADOS` deve apontar para `oficina_teste`. A proteção existente rejeita nomes sem o sufixo `_teste`.
