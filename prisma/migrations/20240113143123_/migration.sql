/*
  Warnings:

  - You are about to drop the column `IssuedQuantity` on the `InventoryRecord` table. All the data in the column will be lost.
  - You are about to drop the column `ReceivedQuantity` on the `InventoryRecord` table. All the data in the column will be lost.
  - You are about to drop the column `openingQuantity` on the `InventoryRecord` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `InventoryRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InventoryRecord" DROP COLUMN "IssuedQuantity",
DROP COLUMN "ReceivedQuantity",
DROP COLUMN "openingQuantity",
DROP COLUMN "year",
ADD COLUMN     "Quantity" JSONB;
