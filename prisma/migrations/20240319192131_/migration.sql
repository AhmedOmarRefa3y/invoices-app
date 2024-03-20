/*
  Warnings:

  - You are about to drop the column `newname` on the `Units` table. All the data in the column will be lost.
  - Made the column `organizationId` on table `Catgories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Initialquantities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `LineItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Part` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `ProductionEvent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `ProductionPLanProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `ProductionPlan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `ReturnedInvoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Units` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Catgories" DROP CONSTRAINT "Catgories_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Initialquantities" DROP CONSTRAINT "Initialquantities_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionPLanProduct" DROP CONSTRAINT "ProductionPLanProduct_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionPlan" DROP CONSTRAINT "ProductionPlan_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnedInvoice" DROP CONSTRAINT "ReturnedInvoice_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Units" DROP CONSTRAINT "Units_organizationId_fkey";

-- AlterTable
ALTER TABLE "Catgories" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Initialquantities" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LineItem" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductionEvent" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductionPLanProduct" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductionPlan" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ReturnedInvoice" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Units" DROP COLUMN "newname",
ALTER COLUMN "organizationId" SET NOT NULL;

-- DropEnum
DROP TYPE "unit";

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Initialquantities" ADD CONSTRAINT "Initialquantities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnedInvoice" ADD CONSTRAINT "ReturnedInvoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPLanProduct" ADD CONSTRAINT "ProductionPLanProduct_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPlan" ADD CONSTRAINT "ProductionPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEvent" ADD CONSTRAINT "ProductionEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catgories" ADD CONSTRAINT "Catgories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Units" ADD CONSTRAINT "Units_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
