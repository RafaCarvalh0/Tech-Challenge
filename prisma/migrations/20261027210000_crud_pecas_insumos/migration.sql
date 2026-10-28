CREATE TABLE "pecas_insumos" (
    "identificador" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco_unitario_em_centavos" INTEGER NOT NULL,
    "quantidade_estoque" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pecas_insumos_pkey" PRIMARY KEY ("identificador"),
    CONSTRAINT "pecas_insumos_preco_nao_negativo" CHECK ("preco_unitario_em_centavos" >= 0),
    CONSTRAINT "pecas_insumos_estoque_nao_negativo" CHECK ("quantidade_estoque" >= 0)
);

CREATE UNIQUE INDEX "pecas_insumos_codigo_key" ON "pecas_insumos"("codigo");
