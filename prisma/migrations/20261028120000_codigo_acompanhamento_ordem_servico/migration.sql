ALTER TABLE "ordens_servico"
ADD COLUMN "codigo_acompanhamento" TEXT;

UPDATE "ordens_servico"
SET "codigo_acompanhamento" = gen_random_uuid()::text;

ALTER TABLE "ordens_servico"
ALTER COLUMN "codigo_acompanhamento" SET NOT NULL;

CREATE UNIQUE INDEX "ordens_servico_codigo_acompanhamento_key"
ON "ordens_servico"("codigo_acompanhamento");
