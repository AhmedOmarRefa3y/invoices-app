-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "returnedInvoiceId" TEXT;

-- CreateTable
CREATE TABLE "ReturnedInvoice" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReturnedInvoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReturnedInvoice" ADD CONSTRAINT "ReturnedInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_returnedInvoiceId_fkey" FOREIGN KEY ("returnedInvoiceId") REFERENCES "ReturnedInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
