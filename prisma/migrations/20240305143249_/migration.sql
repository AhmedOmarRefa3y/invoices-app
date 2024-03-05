-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_initialquantitiesId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productionEventId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productionPlanId_fkey";

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productionEventId_fkey" FOREIGN KEY ("productionEventId") REFERENCES "ProductionEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_initialquantitiesId_fkey" FOREIGN KEY ("initialquantitiesId") REFERENCES "Initialquantities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
