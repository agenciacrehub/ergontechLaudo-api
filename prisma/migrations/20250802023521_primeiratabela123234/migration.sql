-- AlterTable
ALTER TABLE "public"."laudo" ALTER COLUMN "status" SET DEFAULT 'Ativo';

-- CreateIndex
CREATE INDEX "laudo_company_id_idx" ON "public"."laudo"("company_id");

-- CreateIndex
CREATE INDEX "laudo_user_id_idx" ON "public"."laudo"("user_id");

-- CreateIndex
CREATE INDEX "laudo_status_idx" ON "public"."laudo"("status");
