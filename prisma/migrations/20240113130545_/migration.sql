/*
  Warnings:

  - Added the required column `year` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "InventoryRecord" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "openingQuantity" DOUBLE PRECISION NOT NULL,
    "producedQuantity" DOUBLE PRECISION NOT NULL,
    "soldQuantity" DOUBLE PRECISION NOT NULL,
    "closingQuantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InventoryRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryRecord" ADD CONSTRAINT "InventoryRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
