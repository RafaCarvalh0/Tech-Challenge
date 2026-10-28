CREATE TYPE "SituacaoOrcamento" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

CREATE TABLE "orcamentos" (
    "identificador" TEXT NOT NULL,
    "ordem_servico_id" TEXT NOT NULL,
    "subtotal_servicos_em_centavos" INTEGER NOT NULL,
    "subtotal_pecas_insumos_em_centavos" INTEGER NOT NULL,
    "total_em_centavos" INTEGER NOT NULL,
    "situacao" "SituacaoOrcamento" NOT NULL DEFAULT 'PENDENTE',
    "gerado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "decidido_em" TIMESTAMP(3),

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("identificador"),
    CONSTRAINT "orcamentos_subtotal_servicos_nao_negativo" CHECK ("subtotal_servicos_em_centavos" >= 0),
    CONSTRAINT "orcamentos_subtotal_pecas_nao_negativo" CHECK ("subtotal_pecas_insumos_em_centavos" >= 0),
    CONSTRAINT "orcamentos_total_nao_negativo" CHECK ("total_em_centavos" >= 0)
);

CREATE UNIQUE INDEX "orcamentos_ordem_servico_id_key" ON "orcamentos"("ordem_servico_id");

ALTER TABLE "orcamentos"
ADD CONSTRAINT "orcamentos_ordem_servico_id_fkey"
FOREIGN KEY ("ordem_servico_id") REFERENCES "ordens_servico"("identificador") ON DELETE CASCADE ON UPDATE CASCADE;
