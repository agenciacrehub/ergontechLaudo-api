/*
  Warnings:

  - Added the required column `cnpj` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."company" ADD COLUMN     "cnpj" TEXT NOT NULL;
