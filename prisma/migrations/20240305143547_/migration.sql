-- DropForeignKey
ALTER TABLE "ProductionPLanProduct" DROP CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey";

-- AddForeignKey
ALTER TABLE "ProductionPLanProduct" ADD CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
