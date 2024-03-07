-- CreateTable
CREATE TABLE "ProductionPLanProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productionPlanId" TEXT,

    CONSTRAINT "ProductionPLanProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductionPLanProduct" ADD CONSTRAINT "ProductionPLanProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPLanProduct" ADD CONSTRAINT "ProductionPLanProduct_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
