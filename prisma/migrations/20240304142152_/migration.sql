/*
  Warnings:

  - You are about to drop the column `purchInvoiceId` on the `LineItem` table. All the data in the column will be lost.
  - You are about to drop the `Initialquantity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchInvoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Years" AS ENUM ('Year2022', 'Year2023', 'Year2024', 'Year2025', 'Year2026', 'Year2027', 'Year2028', 'Year2029', 'Year2030');

-- DropForeignKey
ALTER TABLE "Initialquantity" DROP CONSTRAINT "Initialquantity_InventoryRecordId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRecord" DROP CONSTRAINT "InventoryRecord_productId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_purchInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "PurchInvoice" DROP CONSTRAINT "PurchInvoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "PurchInvoice" DROP CONSTRAINT "PurchInvoice_paymentId_fkey";

-- AlterTable
ALTER TABLE "LineItem" DROP COLUMN "purchInvoiceId",
ADD COLUMN     "initialquantitiesId" TEXT;

-- DropTable
DROP TABLE "Initialquantity";

-- DropTable
DROP TABLE "InventoryRecord";

-- DropTable
DROP TABLE "PurchInvoice";

-- CreateTable
CREATE TABLE "Initialquantities" (
    "id" TEXT NOT NULL,
    "year" "Years" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Initialquantities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Initialquantities_year_key" ON "Initialquantities"("year");

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_initialquantitiesId_fkey" FOREIGN KEY ("initialquantitiesId") REFERENCES "Initialquantities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
