-- CreateTable
CREATE TABLE "public"."report_up_image" (
    "id" TEXT NOT NULL,
    "report_up_id" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "image_data" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_up_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_up_image_report_up_id_idx" ON "public"."report_up_image"("report_up_id");

-- CreateIndex
CREATE INDEX "report_up_image_image_name_idx" ON "public"."report_up_image"("image_name");

-- AddForeignKey
ALTER TABLE "public"."report_up_image" ADD CONSTRAINT "report_up_image_report_up_id_fkey" FOREIGN KEY ("report_up_id") REFERENCES "public"."report_up"("id") ON DELETE CASCADE ON UPDATE CASCADE;
