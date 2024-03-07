/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductionEvent` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ProductionEvent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_initialquantitiesId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productionEventId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_productionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_productId_fkey";

-- AlterTable
ALTER TABLE "ProductionEvent" DROP COLUMN "productId",
DROP COLUMN "quantity";

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productionEventId_fkey" FOREIGN KEY ("productionEventId") REFERENCES "ProductionEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_initialquantitiesId_fkey" FOREIGN KEY ("initialquantitiesId") REFERENCES "Initialquantities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
