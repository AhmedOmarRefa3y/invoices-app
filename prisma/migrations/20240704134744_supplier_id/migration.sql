/*
  Warnings:

  - You are about to drop the column `customerId` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - Added the required column `SupplierId` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseInvoice" DROP CONSTRAINT "PurchaseInvoice_customerId_fkey";

-- AlterTable
ALTER TABLE "PurchaseInvoice" DROP COLUMN "customerId",
ADD COLUMN     "SupplierId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_SupplierId_fkey" FOREIGN KEY ("SupplierId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
