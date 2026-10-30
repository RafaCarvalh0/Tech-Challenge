# OWASP Top 10 — checklist da entrega

| Categoria | Evidência real | Situação / ação |
|---|---|---|
| A01 Controle de acesso | guarda JWT global; rotas públicas explícitas; código privado da OS | Implementado; autorização administrativa possui um único perfil no MVP |
| A02 Falhas criptográficas | JWT assinado e segredos por variáveis de ambiente | HTTPS depende do ambiente de implantação; não registrar código/JWT |
| A03 Injeção | DTOs com `class-validator`; Prisma parametriza consultas | Evitar SQL bruto e manter validação global |
| A04 Design inseguro | regras no domínio; transações; código não enumerável | Rate limiting não implementado |
| A05 Configuração insegura | configuração por ambiente; `.env` ignorado; Swagger conhecido | Restringir Swagger e CORS conforme ambiente produtivo |
| A06 Componentes vulneráveis | auditorias registradas em `npm-audit-2026-10-30.md` | 3 altas em auditoria sem dev; migração controlada pendente |
| A07 Identificação/autenticação | login administrativo e Bearer JWT | Sem bloqueio por tentativas/rate limiting no MVP |
| A08 Integridade de software/dados | lockfile, migrations e build reproduzível | Assinatura de artefatos e SBOM fora do escopo |
| A09 Logging e monitoramento | erros HTTP padronizados pelo framework | Logging/auditoria estruturados e alertas não implementados |
| A10 SSRF | aplicação não recebe URLs para requisições externas | NÃO APLICÁVEL ao escopo atual; reavaliar se integrações forem incluídas |

## Controles adicionais

- CPF/CNPJ e placa possuem objetos de valor com validação e normalização.
- Operações de estoque e decisão usam transações e rollback.
- Banco E2E deve terminar em `_teste`, reduzindo risco de destruição acidental de dados de desenvolvimento.
- ESLint é evidência de qualidade estática, não foi classificado como SAST de segurança.
