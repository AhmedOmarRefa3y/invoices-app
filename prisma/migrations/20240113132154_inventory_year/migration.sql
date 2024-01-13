/*
  Warnings:

  - You are about to drop the column `closingQuantity` on the `InventoryRecord` table. All the data in the column will be lost.
  - You are about to drop the column `producedQuantity` on the `InventoryRecord` table. All the data in the column will be lost.
  - You are about to drop the column `soldQuantity` on the `InventoryRecord` table. All the data in the column will be lost.
  - You are about to drop the column `initialQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `ProductionEvent` table. All the data in the column will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_inventoryId_fkey";

-- AlterTable
ALTER TABLE "InventoryRecord" DROP COLUMN "closingQuantity",
DROP COLUMN "producedQuantity",
DROP COLUMN "soldQuantity";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "initialQuantity";

-- AlterTable
ALTER TABLE "ProductionEvent" DROP COLUMN "inventoryId";

-- DropTable
DROP TABLE "Inventory";
