-- CreateTable
CREATE TABLE "public"."formularios" (
    "id" TEXT NOT NULL,
    "laudo_id" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formularios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "formularios_laudo_id_idx" ON "public"."formularios"("laudo_id");

-- AddForeignKey
ALTER TABLE "public"."formularios" ADD CONSTRAINT "formularios_laudo_id_fkey" FOREIGN KEY ("laudo_id") REFERENCES "public"."laudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
