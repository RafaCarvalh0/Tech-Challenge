ALTER TABLE "customers" RENAME TO "clientes";
ALTER TABLE "vehicles" RENAME TO "veiculos";
ALTER TABLE "work_orders" RENAME TO "ordens_servico";

ALTER TABLE "clientes" RENAME COLUMN "name" TO "nome";
ALTER TABLE "clientes" RENAME COLUMN "taxId" TO "cpf_cnpj";
ALTER TABLE "clientes" RENAME COLUMN "createdAt" TO "criado_em";

ALTER TABLE "veiculos" RENAME COLUMN "customerId" TO "cliente_id";
ALTER TABLE "veiculos" RENAME COLUMN "plate" TO "placa";
ALTER TABLE "veiculos" RENAME COLUMN "brand" TO "marca";
ALTER TABLE "veiculos" RENAME COLUMN "model" TO "modelo";
ALTER TABLE "veiculos" RENAME COLUMN "year" TO "ano";
ALTER TABLE "veiculos" RENAME COLUMN "createdAt" TO "criado_em";

ALTER TABLE "ordens_servico" RENAME COLUMN "customerId" TO "cliente_id";
ALTER TABLE "ordens_servico" RENAME COLUMN "vehicleId" TO "veiculo_id";
ALTER TABLE "ordens_servico" RENAME COLUMN "description" TO "descricao";
ALTER TABLE "ordens_servico" RENAME COLUMN "createdAt" TO "criado_em";
ALTER TABLE "ordens_servico" RENAME COLUMN "updatedAt" TO "atualizado_em";
