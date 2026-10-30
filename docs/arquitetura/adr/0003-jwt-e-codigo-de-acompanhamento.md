# ADR 0003 — JWT e código de acompanhamento

- Status: Aceita

## Contexto

A equipe precisa acessar operações administrativas, enquanto o cliente precisa consultar e decidir somente sua OS sem conta administrativa.

## Decisão

Proteger APIs administrativas com JWT e liberar rotas específicas de acompanhamento mediante identificador da OS e código privado gerado na abertura.

## Alternativas

- JWT para clientes: rejeitado por ampliar cadastro e recuperação de identidade fora do MVP.
- Rotas públicas somente pelo ID: rejeitadas por expor ordens enumeráveis.

## Consequências

Separação clara entre acesso administrativo e acompanhamento; o código deve ser tratado como segredo. Não substitui uma solução completa de identidade do cliente em fases futuras.

## Referências

`src/modulos/autenticacao/`, `src/modulos/acompanhamento/`.
