-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_returnedInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_productId_fkey";

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_returnedInvoiceId_fkey" FOREIGN KEY ("returnedInvoiceId") REFERENCES "ReturnedInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEvent" ADD CONSTRAINT "ProductionEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEvent" ADD CONSTRAINT "ProductionEvent_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
