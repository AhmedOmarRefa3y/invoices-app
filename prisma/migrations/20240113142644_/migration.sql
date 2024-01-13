/*
  Warnings:

  - The `openingQuantity` column on the `InventoryRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InventoryRecord" DROP COLUMN "openingQuantity",
ADD COLUMN     "openingQuantity" JSONB;
