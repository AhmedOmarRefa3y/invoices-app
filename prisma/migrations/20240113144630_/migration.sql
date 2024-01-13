-- DropForeignKey
ALTER TABLE "InventoryRecord" DROP CONSTRAINT "InventoryRecord_productId_fkey";

-- AddForeignKey
ALTER TABLE "InventoryRecord" ADD CONSTRAINT "InventoryRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
