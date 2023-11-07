-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
