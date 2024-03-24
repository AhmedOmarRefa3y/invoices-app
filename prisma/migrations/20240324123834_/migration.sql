/*
  Warnings:

  - Made the column `catgoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_catgoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_unitId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "catgoryId" SET NOT NULL,
ALTER COLUMN "unitId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_catgoryId_fkey" FOREIGN KEY ("catgoryId") REFERENCES "Catgories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
