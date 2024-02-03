-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "catgoryId" TEXT;

-- CreateTable
CREATE TABLE "catgory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "catgory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_catgoryId_fkey" FOREIGN KEY ("catgoryId") REFERENCES "catgory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
