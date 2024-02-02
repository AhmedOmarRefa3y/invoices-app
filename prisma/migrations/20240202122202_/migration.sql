/*
  Warnings:

  - Changed the type of `name` on the `Units` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "unit" AS ENUM ('piece', 'kit', 'klg');

-- AlterTable
ALTER TABLE "Units" DROP COLUMN "name",
ADD COLUMN     "name" "unit" NOT NULL;
