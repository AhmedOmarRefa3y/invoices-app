"use server";
import prismaDb from "@/lib/prisma";

interface getAllTransactionsProps {
  orgid: string;
  customerID: string;
}
export const getAllTransactions = async ({ orgid, customerID }: getAllTransactionsProps) => {
  try {
    const Data = await prismaDb.customer.findFirst({
      where: {
        organizationId: orgid,
        id: customerID,
      },
      include: {
        invoices: {
          include: {
            orders: {
              include: {
                Product: true,
              },
            },
          },
        },
        Payment: true,
        ReturnedInvoice: true,
        PurchaseInvoice: true,
        PaymentToSupplier: true,
      },
    });

    return {
      status: "ok",
      Data: Data,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while Fetching customer transactions",
    };
  }
};
