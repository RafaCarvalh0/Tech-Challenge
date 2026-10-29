# Aderência Final da Fase 1 — Design

## Objetivo

Eliminar as ressalvas restantes da comparação com o Tech Challenge: permitir a decisão do orçamento pelo cliente, reforçar a cobertura dos casos de uso críticos de OS e alinhar dependências/relatório de segurança.

## Abordagens consideradas

1. Tornar pública a rota administrativa de decisão. Rejeitada porque exporia uma operação sensível sem validar o cliente.
2. Criar uma rota pública no módulo de acompanhamento que valide `X-Codigo-Acompanhamento` e reutilize o caso de uso transacional de decisão. Escolhida por preservar a autenticação administrativa e evitar duplicação da regra de negócio.
3. Criar autenticação completa de clientes. Rejeitada por ampliar o MVP além do PDF.

## Solução

- Expor `PATCH /api/acompanhamento/ordens-servico/:identificador/orcamento/decisao` como rota pública.
- Validar o código de acompanhamento antes de executar qualquer decisão e responder sem revelar se a OS existe quando o código for inválido.
- Reutilizar `CasoUsoDecidirOrcamento`; estoque, concorrência e transações permanecem no repositório atual.
- Adicionar testes unitários para composição, geração e decisão de orçamento, priorizando comportamento e erros.
- Fixar `prisma` e `@prisma/client` em `6.19.3` e atualizar o relatório com as vulnerabilidades remanescentes, sem migração automática para Prisma 7.

## Fora do escopo

- Login de cliente, envio por e-mail ou notificações.
- Migração para Prisma 7.
- Mudança da arquitetura monolítica ou dos contratos administrativos existentes.
