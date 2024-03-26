/*
  Warnings:

  - You are about to drop the column `productPackageId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `productPackageId` on the `Part` table. All the data in the column will be lost.
  - You are about to drop the `ProductPackage` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `productId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `partProductId` on table `Part` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productPackageId_fkey";

-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_productPackageId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPackage" DROP CONSTRAINT "ProductPackage_unitId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "productPackageId",
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Part" DROP COLUMN "productPackageId",
ALTER COLUMN "partProductId" SET NOT NULL;

-- DropTable
DROP TABLE "ProductPackage";

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
