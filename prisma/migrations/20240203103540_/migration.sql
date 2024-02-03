-- CreateEnum
CREATE TYPE "unit" AS ENUM ('piece', 'kit', 'klg');

-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "partProductId" TEXT;

-- AlterTable
ALTER TABLE "Units" ADD COLUMN     "newname" "unit";
