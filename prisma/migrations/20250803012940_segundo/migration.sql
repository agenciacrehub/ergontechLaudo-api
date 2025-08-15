-- CreateTable
CREATE TABLE "public"."form_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "laudo_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_tokens_token_key" ON "public"."form_tokens"("token");

-- CreateIndex
CREATE INDEX "form_tokens_token_idx" ON "public"."form_tokens"("token");

-- CreateIndex
CREATE INDEX "form_tokens_laudo_id_idx" ON "public"."form_tokens"("laudo_id");

-- CreateIndex
CREATE INDEX "form_tokens_expires_at_idx" ON "public"."form_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "public"."form_tokens" ADD CONSTRAINT "form_tokens_laudo_id_fkey" FOREIGN KEY ("laudo_id") REFERENCES "public"."laudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
