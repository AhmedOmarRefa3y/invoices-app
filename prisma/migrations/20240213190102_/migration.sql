-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "isProduction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReduction" BOOLEAN NOT NULL DEFAULT false;
