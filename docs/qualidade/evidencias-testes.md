# Evidências de qualidade

- Data: 02/11/2026
- Branch: `main`
- Hash de referência desta rodada: `6eb499edef5dba4210998a169a97969e2b615a0e`
- Banco E2E: `postgresql://postgres:postgres@localhost:5433/oficina_teste?schema=public`

| Validação | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | aprovado |
| Build | `npm run build` | aprovado |
| Unitários e cobertura | `npm run test:cov -- --runInBand` | 33 suítes, 130 testes, 100% no escopo configurado |
| E2E | `npm run test:ponta-a-ponta -- --runInBand` | 4 suítes, 26 testes aprovados |

## Reprodução no PowerShell

```powershell
npm ci
npm run prisma:generate
npm run lint
npm run build
npm run test:cov -- --runInBand

$env:URL_BANCO_DADOS='postgresql://postgres:postgres@localhost:5433/oficina_teste?schema=public'
npm run prisma:deploy
npm run test:ponta-a-ponta -- --runInBand
```

As validações devem ser repetidas no hash final; os números acima são a linha de base comprovada durante a preparação.
