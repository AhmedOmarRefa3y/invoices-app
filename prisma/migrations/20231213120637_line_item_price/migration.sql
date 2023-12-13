/*
  Warnings:

  - Added the required column `price` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "price" INTEGER NOT NULL;
