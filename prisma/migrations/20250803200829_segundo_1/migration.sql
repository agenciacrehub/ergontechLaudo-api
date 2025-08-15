-- CreateTable
CREATE TABLE "public"."report_up" (
    "id" TEXT NOT NULL,
    "laudo_id" TEXT NOT NULL,
    "conteudo" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_up_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_up_laudo_id_idx" ON "public"."report_up"("laudo_id");

-- AddForeignKey
ALTER TABLE "public"."report_up" ADD CONSTRAINT "report_up_laudo_id_fkey" FOREIGN KEY ("laudo_id") REFERENCES "public"."laudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
