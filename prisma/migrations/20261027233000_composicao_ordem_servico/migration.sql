CREATE TABLE "itens_servicos_ordem" (
    "identificador" TEXT NOT NULL,
    "ordem_servico_id" TEXT NOT NULL,
    "servico_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco_unitario_em_centavos" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "itens_servicos_ordem_pkey" PRIMARY KEY ("identificador"),
    CONSTRAINT "itens_servicos_ordem_quantidade_positiva" CHECK ("quantidade" > 0),
    CONSTRAINT "itens_servicos_ordem_preco_nao_negativo" CHECK ("preco_unitario_em_centavos" >= 0)
);

CREATE TABLE "itens_pecas_insumos_ordem" (
    "identificador" TEXT NOT NULL,
    "ordem_servico_id" TEXT NOT NULL,
    "peca_insumo_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco_unitario_em_centavos" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "itens_pecas_insumos_ordem_pkey" PRIMARY KEY ("identificador"),
    CONSTRAINT "itens_pecas_insumos_ordem_quantidade_positiva" CHECK ("quantidade" > 0),
    CONSTRAINT "itens_pecas_insumos_ordem_preco_nao_negativo" CHECK ("preco_unitario_em_centavos" >= 0)
);

CREATE UNIQUE INDEX "itens_servicos_ordem_ordem_servico_id_servico_id_key"
ON "itens_servicos_ordem"("ordem_servico_id", "servico_id");
CREATE INDEX "itens_servicos_ordem_servico_id_idx" ON "itens_servicos_ordem"("servico_id");

CREATE UNIQUE INDEX "itens_pecas_insumos_ordem_ordem_servico_id_peca_insumo_id_key"
ON "itens_pecas_insumos_ordem"("ordem_servico_id", "peca_insumo_id");
CREATE INDEX "itens_pecas_insumos_ordem_peca_insumo_id_idx"
ON "itens_pecas_insumos_ordem"("peca_insumo_id");

ALTER TABLE "itens_servicos_ordem"
ADD CONSTRAINT "itens_servicos_ordem_ordem_servico_id_fkey"
FOREIGN KEY ("ordem_servico_id") REFERENCES "ordens_servico"("identificador") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "itens_servicos_ordem"
ADD CONSTRAINT "itens_servicos_ordem_servico_id_fkey"
FOREIGN KEY ("servico_id") REFERENCES "servicos"("identificador") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "itens_pecas_insumos_ordem"
ADD CONSTRAINT "itens_pecas_insumos_ordem_ordem_servico_id_fkey"
FOREIGN KEY ("ordem_servico_id") REFERENCES "ordens_servico"("identificador") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "itens_pecas_insumos_ordem"
ADD CONSTRAINT "itens_pecas_insumos_ordem_peca_insumo_id_fkey"
FOREIGN KEY ("peca_insumo_id") REFERENCES "pecas_insumos"("identificador") ON DELETE RESTRICT ON UPDATE CASCADE;
