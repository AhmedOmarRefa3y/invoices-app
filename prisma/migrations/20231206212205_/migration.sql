/*
  Warnings:

  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `catgory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_catgoryId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unit",
ADD COLUMN     "unitId" TEXT;

-- DropTable
DROP TABLE "catgory";

-- CreateTable
CREATE TABLE "Catgories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Catgories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Units_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_catgoryId_fkey" FOREIGN KEY ("catgoryId") REFERENCES "Catgories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
