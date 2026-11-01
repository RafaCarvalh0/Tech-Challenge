# ADR 0003 — Separar acesso administrativo e acompanhamento do cliente

- Status: Aceita
- Data: 30/10/2026
- Última revisão editorial: 31/10/2026 — sem alteração da decisão
- Responsável: Rafael Abreu de Carvalho — RM378596

## Contexto

A equipe precisa acessar operações administrativas, enquanto o cliente precisa consultar e decidir somente a própria OS sem conta administrativa. Expor apenas o identificador da OS não oferece proteção suficiente, mas implementar identidade completa para clientes ampliaria o MVP.

## Decisão

Protegemos as APIs administrativas com JWT. As rotas específicas de acompanhamento validam conjuntamente o identificador da OS e um código privado gerado na abertura. O código não concede acesso às demais operações administrativas.

## Alternativas

- JWT para clientes: rejeitado por ampliar cadastro e recuperação de identidade fora do MVP.
- Rotas públicas somente pelo ID: rejeitadas por expor ordens enumeráveis.

## Consequências positivas

- Separação clara entre operações da oficina e ações permitidas ao cliente.
- Acompanhamento disponível sem cadastro ou recuperação de senha para o cliente.
- Uma OS não pode ser consultada ou decidida somente pelo identificador.

## Consequências negativas e riscos

- O código de acompanhamento deve ser transmitido e tratado como segredo.
- Não há identidade, revogação individual ou recuperação de acesso do cliente nesta fase.
- Rate limiting e expiração do código devem ser considerados antes de uso produtivo.

## Referências

`src/modulos/autenticacao/`, `src/modulos/acompanhamento/`.
