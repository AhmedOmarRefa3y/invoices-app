/*
  Warnings:

  - You are about to drop the column `Quantity` on the `InventoryRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InventoryRecord" DROP CONSTRAINT "InventoryRecord_productId_fkey";

-- AlterTable
ALTER TABLE "InventoryRecord" DROP COLUMN "Quantity",
ADD COLUMN     "IssuedQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ReceivedQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "openingQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2024;

-- AddForeignKey
ALTER TABLE "InventoryRecord" ADD CONSTRAINT "InventoryRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
