/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "invoiceId";

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
