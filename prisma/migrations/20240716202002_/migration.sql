/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_OrganizationManagers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationManagers" DROP CONSTRAINT "_OrganizationManagers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationManagers" DROP CONSTRAINT "_OrganizationManagers_B_fkey";

-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_ownerId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- DropTable
DROP TABLE "_OrganizationManagers";
