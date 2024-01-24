/*
  Warnings:

  - You are about to drop the column `amount` on the `LineItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `LineItem` table. All the data in the column will be lost.
  - You are about to drop the column `catgoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductionEvent` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ProductionEvent` table. All the data in the column will be lost.
  - You are about to drop the `Part` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId]` on the table `InventoryRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_catgoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionEvent" DROP CONSTRAINT "ProductionEvent_productId_fkey";

-- AlterTable
ALTER TABLE "LineItem" DROP COLUMN "amount",
DROP COLUMN "price",
ADD COLUMN     "productionEventId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "catgoryId",
DROP COLUMN "invoiceId",
ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "ProductionEvent" DROP COLUMN "productId",
DROP COLUMN "quantity";

-- DropTable
DROP TABLE "Part";

-- CreateTable
CREATE TABLE "ProductPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productPackageId" TEXT,
    "productId" TEXT,
    "invoiceId" TEXT,
    "returnedInvoiceId" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Initialquantity" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "InventoryRecordId" TEXT NOT NULL,

    CONSTRAINT "Initialquantity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToProductPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductPackage_AB_unique" ON "_ProductToProductPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductPackage_B_index" ON "_ProductToProductPackage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryRecord_productId_key" ON "InventoryRecord"("productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Catgories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPackage" ADD CONSTRAINT "ProductPackage_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productPackageId_fkey" FOREIGN KEY ("productPackageId") REFERENCES "ProductPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_returnedInvoiceId_fkey" FOREIGN KEY ("returnedInvoiceId") REFERENCES "ReturnedInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_productionEventId_fkey" FOREIGN KEY ("productionEventId") REFERENCES "ProductionEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Initialquantity" ADD CONSTRAINT "Initialquantity_InventoryRecordId_fkey" FOREIGN KEY ("InventoryRecordId") REFERENCES "InventoryRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductPackage" ADD CONSTRAINT "_ProductToProductPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductPackage" ADD CONSTRAINT "_ProductToProductPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
