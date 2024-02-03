/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `ProductionEvent` table. All the data in the column will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_inventoryId_fkey";

-- AlterTable
ALTER TABLE "ProductionEvent" DROP COLUMN "inventoryId";

-- DropTable
DROP TABLE "Inventory";

-- CreateTable
CREATE TABLE "InventoryRecord" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2024,
    "openingQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "IssuedQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ReceivedQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "InventoryRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryRecord" ADD CONSTRAINT "InventoryRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
