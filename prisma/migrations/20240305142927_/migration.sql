-- DropForeignKey
ALTER TABLE "ProductionPLanProduct" DROP CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey";

-- AlterTable
ALTER TABLE "ProductionPLanProduct" ALTER COLUMN "productionPlanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductionPLanProduct" ADD CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
