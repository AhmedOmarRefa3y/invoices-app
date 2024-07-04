/*
  Warnings:

  - You are about to drop the column `supplierId` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseInvoice" DROP CONSTRAINT "PurchaseInvoice_supplierId_fkey";

-- AlterTable
ALTER TABLE "PurchaseInvoice" DROP COLUMN "supplierId",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
