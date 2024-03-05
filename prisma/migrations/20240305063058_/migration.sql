/*
  Warnings:

  - Changed the type of `year` on the `Initialquantities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Initialquantities" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Years";

-- CreateIndex
CREATE UNIQUE INDEX "Initialquantities_year_key" ON "Initialquantities"("year");
