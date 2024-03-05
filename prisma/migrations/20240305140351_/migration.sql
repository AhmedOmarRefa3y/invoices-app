/*
  Warnings:

  - Made the column `productionPlanId` on table `ProductionEvent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productionPlanId` on table `ProductionPLanProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_productionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionPLanProduct" DROP CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey";

-- AlterTable
ALTER TABLE "ProductionEvent" ALTER COLUMN "productionPlanId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductionPLanProduct" ALTER COLUMN "productionPlanId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductionPLanProduct" ADD CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEvent" ADD CONSTRAINT "ProductionEvent_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
